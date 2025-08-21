import { Op } from "sequelize";
import { sequelize } from "../database/config";
import { CreateAttendenceRequest } from "../dtos/attendence.dto";
import {
  CreateEventRequest,
  CreateEventResponse,
  EventDetailResponse,
  EventResponse,
  IUser,
} from "../dtos/events/create-event.dto";
import { Attendance } from "../models/attendence.model";
import { Events } from "../models/event.model";
import { User } from "../models/user.model";
import { UpdateEventRequest } from "../dtos/events/update-event.dto";

export class EventServices {
  createEvents = async (
    model: CreateEventRequest,
    currentUserId: number
  ): Promise<CreateEventResponse> => {
    const transaction = await sequelize.transaction();
    try {
      let participantIds: number[] = [];
      try {
        if (typeof model.participantIds === "string") {
          participantIds = JSON.parse(model.participantIds);
        } else if (Array.isArray(model.participantIds)) {
          participantIds = model.participantIds;
        } else {
          throw new Error("Invalid format! Must be Json array");
        }
      } catch (error) {
        throw error;
      }

      participantIds = [...new Set([...participantIds, currentUserId])]
        .map((item) => Number(item))
        .sort();
      
      const createPayload = {
        content: model.content,
        description: model.description,
        startDate: model.startDate,
        endDate: model.endDate,
      };
      const event = await Events.create(createPayload, { transaction });
      if (!event || !event.id) throw new Error("Failed to create event");

      const bulkCreatePayload = participantIds.map(
        (item) =>
          new CreateAttendenceRequest({
            eventId: event.id,
            userId: item,
            status: "pending",
          })
      );
      const result = await Attendance.bulkCreate(bulkCreatePayload, {
        transaction,
      });
      if (!result)
        throw new Error(
          "Failed to create attendences for eventId: " + event.id
        );

      await transaction.commit();
      return new CreateEventResponse(event);
    } catch (error) {
      transaction.rollback();
      throw new Error("An error occurs in event creation: " + error);
    }
  };

  getEvents = async (
    currentUserId: number,
    startDate: Date,
    endDate: Date
  ): Promise<EventResponse[]> => {
    try {
      const events = await Events.findAll({
        include: [
          {
            model: Attendance,
            where: { userId: currentUserId },
            required: true,
          },
        ],
        where: {
          startDate: { [Op.gte]: startDate },
          endDate: { [Op.lte]: endDate },
        },
        order: [["startDate", "ASC"]],
      });

      return events.map((e) => new EventResponse(e));
    } catch (error) {
      throw new Error("An error occurred while fetching events: " + error);
    }
  };
  getEventsByDate = async (
    userId: number,
    date: Date
  ): Promise<EventResponse[]> => {
    try {
      const startOfDay = new Date(date);
      const endOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      endOfDay.setHours(23, 59, 59, 99);

      const events = await Events.findAll({
        where: {
          [Op.or]: [
            {
              startDate: { [Op.between]: [startOfDay, endOfDay] },
            },
            {
              endDate: { [Op.between]: [startOfDay, endOfDay] },
            },
            {
              startDate: { [Op.lte]: startOfDay },
              endDate: { [Op.gte]: endOfDay },
            },
          ],
        },
        include: [
          {
            model: Attendance,
            where: { userId: userId },
            required: true,
            include: [
              {
                model: User,
                attributes: ["id", "username", "email"],
              },
            ],
          },
        ],
        order: [["startDate", "ASC"]],
      });

      return events.map((e) => new EventResponse(e));
    } catch (error) {
      throw new Error("An error occurred while fetching events: " + error);
    }
  };

  getEventDetails = async (id: number): Promise<EventDetailResponse> => {
    try {
      const event = await Events.findByPk(id, {
        include: [
          {
            model: Attendance,
            as: "attendances",
            required: true,
            include: [
              {
                model: User,
                as: "user",
                attributes: ["id", "username", "email"],
                where: { status: "confirmed" },
              },
            ],
          },
        ],
      });
      if (!event) {
        throw new Error("Not found event with id: " + id);
      }
      const unConfirm = await Attendance.findAll({
        where: {
          eventId: id,
          [Op.or]: [{ status: "pending" }, { status: "declined" }],
        },
        include: [
          {
            model: User,
            as: "user",
            attributes: ["id", "username", "email"],
          },
        ],
      });

      const unConfirmUser = unConfirm.map((item) => ({
        id: item.user.id,
        username: item.user.userName,
        email: item.user.email,
      }));

      return new EventDetailResponse(event, unConfirmUser);
    } catch (error) {
      console.log(error);
      throw new Error("An error occurs when get event details: " + error);
    }
  };
  updateEvents = async (
  id: number,
  model: UpdateEventRequest,
  currentUserId: number
): Promise<EventDetailResponse> => {
  const transaction = await sequelize.transaction();
  try {
    const event = await Events.findByPk(id, { transaction });
   
    if (!event) throw new Error("Event not found");
   const unConfirmedUsers: IUser[] = event.attendances
  ?.filter(a => a.status === "pending")
  .map(a => ({
    id: a.user.id,
    username: a.user.userName,
    email: a.user.email
  })) || [];
    
    await event.update(
      {
        title: model.title,
        content: model.content,
        description: model.description,
        startDate: model.startDate,
        endDate: model.endDate,
      },
      { transaction }
    );

    
    let participantIds = Array.isArray(model.participantIds)
      ? model.participantIds
      : [];

    participantIds = [...new Set([...participantIds, currentUserId])];

    const existingAttendances = await Attendance.findAll({
      where: { eventId: id },
      transaction,
    });
    const existingUserIds = existingAttendances.map((a) => a.userId);

    const newUserIds = participantIds.filter((uid) => !existingUserIds.includes(uid));

    const removedUserIds = existingUserIds.filter(
      (uid) => !participantIds.includes(uid)
    );

    if (newUserIds.length > 0) {
      const newAttendances = newUserIds.map(
        (uid) =>
          new CreateAttendenceRequest({
            eventId: id,
            userId: uid,
            status: "pending",
          })
      );
      await Attendance.bulkCreate(newAttendances, { transaction });
    }

    if (removedUserIds.length > 0) {
      await Attendance.destroy({
        where: { eventId: id, userId: removedUserIds },
        transaction,
      });
    }

    await transaction.commit();
    return new EventDetailResponse(event, unConfirmedUsers)
  } catch (error) {
    await transaction.rollback();
    throw new Error("Failed to update event: " + error);
  }
};
}
