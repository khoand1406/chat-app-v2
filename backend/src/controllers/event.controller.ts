import { Request, Response } from "express";
import { EventServices } from "../services/event.services";
import { Events } from "../models/event.model";

export class EventController {
  private readonly _EventServices: EventServices;
  constructor(private readonly eventServices?: EventServices) {
    this._EventServices = eventServices ?? new EventServices();
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
    try {
      const userId = (request as any).userId;
      if (!userId || isNaN(userId))
        return response.status(400).json({ error: "Invalid userId" });

      const {
        title,
        description,
        content,
        startDate,
        endDate,
        participantIds,
      } = request.body;
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

      const createPayload = {
        title: title,
        description: description,
        content: content,
        startDate: startDate,
        endDate: endDate,
        participantIds: participantIds,
      };
      const result = await this._EventServices.createEvents(
        createPayload,
        userId
      );
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
      const eventId_raw= request.params.id;
      const eventId= parseInt(eventId_raw);

      const event= await Events.findByPk(eventId);
      if(!event) return response.status(400).json({error: "Event not found"});

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
      const updatePayLoad= {
        title: title,
        content: content,
        description: description,
        startDate:startDate,
        endDate: endDate,
        participantIds: participantIds
      }
      const result= this._EventServices.updateEvents(eventId, updatePayLoad, userId);
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
}
