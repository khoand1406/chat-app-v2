import { sequelize } from "../database/config";
import { CreateAttendenceRequest } from "../dtos/attendence.dto";
import {
  CreateEventRequest,
  CreateEventResponse,
  EventResponse,
} from "../dtos/create-event.dto";
import { Attendance } from "../models/attendence.model";
import { Events } from "../models/event.model";
import { Op } from "sequelize";

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
      const events = await Events.findAll({
        include: [
          {
            model: Attendance,
            where: { userId: userId },
            required: true,
          },
        ],
        where: {
          
        },
        order: [["startDate", "ASC"]],
      });

      return events.map((e) => new EventResponse(e));
    } catch (error) {
      throw new Error("An error occurred while fetching events: " + error);
    }
  };
}
