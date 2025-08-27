import { Request, Response } from "express";
import { EventServices } from "../services/event.services";
import { Events } from "../models/event.model";
import { sequelize } from "../database/config";
import { NotificationServices } from "../services/notification.services";
import { threadId } from "worker_threads";
import { User } from "../models/user.model";
import { Attendance } from "../models/attendence.model";
import { Notification } from "../models/notification.model";

export class EventController {
  private readonly _EventServices: EventServices;
  private readonly _NotificationServices: NotificationServices;
  constructor(
    private readonly eventServices?: EventServices,
    private readonly notificationService?: NotificationServices
  ) {
    this._EventServices = eventServices ?? new EventServices();
    this._NotificationServices =
      notificationService ?? new NotificationServices();
  }
  getEvents = async (request: Request, response: Response) => {
    try {
      const userId = (request as any).userId;

      if (!userId || isNaN(userId))
        return response.status(400).json({ error: "Invalid userId" });

      const { startDate, endDate } = request.query;
      if (!startDate || !endDate)
        return response.status(400).json({ error: "Invalid date" });

      const start = new Date(startDate as string);
      const end = new Date(endDate as string);

      const result = await this._EventServices.getEvents(userId, start, end);
      return response.status(200).json(result);
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        return response.status(400).json({ error: error.message });
      }
      return response.status(500).json(error);
    }
  };

  getEventsByDate = async (request: Request, response: Response) => {
    try {
      const userId = (request as any).userId;
      if (!userId || isNaN(userId))
        return response.status(400).json({ error: "Invalid userId" });

      const { date } = request.query;
      if (!date) return response.status(400).json({ error: "Missing date" });

      const date_parsed = new Date(date as string);
      const result = await this._EventServices.getEventsByDate(
        userId,
        date_parsed
      );

      return response.status(200).json(result);
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        return response.status(400).json({ error: error.message });
      }
      return response.status(500).json(error);
    }
  };

  getEventDetails = async (request: Request, response: Response) => {
    try {
      const userId = (request as any).userId;
      if (!userId || isNaN(userId))
        return response.status(400).json({ error: "Invalid userId" });

      const eventId_raw = request.params.id;
      if (!eventId_raw)
        return response
          .status(400)
          .json({ error: "Invalid request. Missing event Id" });

      const eventId = parseInt(eventId_raw);
      const result = await this._EventServices.getEventDetails(eventId);
      return response.status(200).json(result);
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        return response.status(400).json({ error: error.message });
      }
      return response.status(500).json(error);
    }
  };

  createEvent = async (request: Request, response: Response) => {
    const io = request.app.get("io");
    try {
      const userId = (request as any).userId;
      if (!userId || isNaN(userId))
        return response.status(400).json({ error: "Invalid userId" });

      const user = await User.findByPk(userId);

      const { content, description, startDate, endDate, participantIds } =
        request.body;
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (!startDate || !endDate) {
        return response.status(400).json({ error: "Missing required fields" });
      }
      if (start >= end) {
        return response
          .status(400)
          .json({ error: "End date must be after start date" });
      }

      const createPayload = {
        content: content,
        description: description,
        startDate: startDate,
        endDate: endDate,
        participantIds: participantIds,
      };
      const result = await this._EventServices.createEvents(
        createPayload,
        userId
      );
      io.emit("event:created", result);
      const targetParticipants = participantIds.filter(
        (pid: number) => pid !== userId
      );

      const notifications = {
        title: `New notification`,
        content: `You have been invited to event: ${content} by ${user?.userName}`,
        userId: userId,
        createdAt: new Date(),
        type: "event_invited",
        eventId: result.id,
      };

      await this._NotificationServices.sendUsersNotification(
        targetParticipants,
        notifications
      );

      targetParticipants.forEach((pid: number) => {
        io.to(`user_${pid}`).emit("newNotification", {
          id: Date.now() + "_" + pid,
          title: "New Events Incoming",
          content: `You have been invited to event: ${content} by ${user?.userName}`,
          userId: pid,
          createdAt: new Date(),
          type: "event_invited",
          eventId: result.id,
        });
      });

      return response.status(201).json(result);
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        return response.status(400).json({ error: error.message });
      }
      return response.status(500).json(error);
    }
  };

  updateEvent = async (request: Request, response: Response) => {
    try {
      const userId = (request as any).userId;
      if (!userId || isNaN(userId))
        return response.status(400).json({ error: "Invalid userId" });
      const {
        title,
        content,
        description,
        startDate,
        endDate,
        participantIds,
      } = request.body;
      const eventId_raw = request.params.id;
      const eventId = parseInt(eventId_raw);

      const event = await Events.findByPk(eventId);
      if (!event)
        return response.status(400).json({ error: "Event not found" });

      const start = new Date(startDate);
      const end = new Date(endDate);

      if (!title || !startDate || !endDate) {
        return response.status(400).json({ error: "Missing required fields" });
      }
      if (start >= end) {
        return response
          .status(400)
          .json({ error: "End date must be after start date" });
      }
      const updatePayLoad = {
        title: title,
        content: content,
        description: description,
        startDate: startDate,
        endDate: endDate,
        participantIds: participantIds,
      };
      const result = await this._EventServices.updateEvents(
        eventId,
        updatePayLoad,
        userId
      );
      return response.status(200).json({ success: true, result });
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        return response.status(400).json({ error: error.message });
      }
      return response.status(500).json(error);
    }
  };

  deleteEvent = async (request: Request, response: Response) => {
    try {
    } catch (error) {}
  };

  confirmEvent = async (request: Request, response: Response) => {
    const io = request.app.get("io");
    try {
      const userId = (request as any).userId;
      if (!userId || isNaN(userId))
        return response.status(400).json({ error: "Invalid userId" });
      const { eventId } = request.body;
      if (!eventId)
        return response.status(400).json({ error: "Not found eventId" });
      const event = await this._EventServices.confirmEvents(userId, eventId);

       await Notification.update(
      { status: "confirmed" }, 
      { where: { eventId, userId } }
    );
      const participants = await Attendance.findAll({
        where: { eventId },
        attributes: ["userId"],
      });
      const participantIds = participants.map((item) => item.userId);
      participantIds.forEach((element) => {
        io.to(`user_${element}`).emit("event:confirmed", {
          id: event.id,
          content: event.content,
          description: event.description,
          startDate: event.startDate,
          endDate: event.endDate,
          confirmedBy: userId,
          status: "confirmed",
        });
      });

      return response.status(200).json({ success: true });
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        return response.status(400).json({ error: error.message });
      }
      return response.status(500).json({ error });
    }
  };

  rejectEvent = async (request: Request, response: Response) => {
    const io= request.app.get("io");
    try {
      const userId = (request as any).userId;
      if (!userId || isNaN(userId))
        return response.status(400).json({ error: "Invalid userId" });
      const { eventId}  = request.body;
      if (!eventId)
        return response.status(400).json({ error: "Not found eventId" });
      const event= await this._EventServices.rejectEvents(userId, eventId);

      await Notification.update(
      { status: "rejected" }, 
      { where: { eventId, userId } }
    );
      

      return response.status(200).json({ success: true });
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        return response.status(400).json({ error: error.message });
      }
      return response.status(500).json({ error });
    }
  };
}
