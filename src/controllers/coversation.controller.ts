import { Request, Response } from "express";
import {
    conversationCreateRequest,
    groupCreateRequest,
} from "../dtos/conversation/create-conversation.dto";
import { ConversationServices } from "../services/conversation.services";

export class ConversationController {
    private _service: ConversationServices;

  constructor(private readonly service?: ConversationServices) {
    this._service = service ?? new ConversationServices();
  }

  getConversations = async (request: Request, response: Response) => {
    try {
      const userid = request.params.id;
      if (userid == null) {
        return response.status(401).json({ Error: "UserId not found" });
      }
        if (isNaN(parseInt(userid))) {
            return response.status(401).json({ Error: "Invalid UserId" });
        }
      const result = await this._service.getUserConversations(parseInt(userid));
      return response.status(200).json(result);
    } catch (error) {
      return response.status(401).json({ Error: `${error}` });
    }
  };

  createGroupConversation = async (request: Request, response: Response) => {
    try {
      const data = request.body;
      if (data === null || data.length === 0) {
        return response.status(400).json({ Error: "Data not found" });
      }
      if (data.participantIds === null || data.participantIds.length === 0) {
        return response
          .status(400)
          .json({ Error: "Participant IDs not found" });
      }
      const Conversation = new groupCreateRequest(data);
      const result = await this._service.createGroupConversation(Conversation);
      return response.status(201).json(result);
    } catch (error) {
      return response.status(400).json({ Error: `${error}` });
    }
  };

  createUserConversation = async (request: Request, response: Response) => {
    try {
      const data = request.body;
      if (data === null) {
        return response.status(400).json({ Error: "Data not found" });
      }
      if (data.participantIds === null || data.participantIds.length === 0) {
        return response
          .status(400)
          .json({ Error: "Participant IDs not found" });
      }
      const Conversation = new conversationCreateRequest(data);
      const result = await this._service.createUserConversation(Conversation);
      return response.status(201).json(result);
    } catch (error) {
      if (error instanceof Error) {
        return response.status(400).json({ Error: `${error.message}` });
      }
      return response.status(500).json({ Error: `${error}` });
    }
  };

  deleteGroupConversation = async (
    request: Request,
    response: Response
  ) => {
    try {
      const conversationId = request.params.id;
      if (!conversationId) {
        return response.status(401).json({ Error: "Conversation ID not found" });
      }
      const result = await this._service.deleteGroupConversation(
        parseInt(conversationId)
      );
      return response.status(200).json(result);
    } catch (error) {
      return response.status(500).json({ Error: `${error}` });
    }
  }
}
