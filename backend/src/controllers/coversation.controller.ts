import { Request, Response } from "express";
import {
    conversationCreateRequest,
    groupCreateRequest,
    userConversationCreateRequest,
} from "../dtos/conversation/create-conversation.dto";
import { ConversationServices } from "../services/conversation.services";
import { Token } from "../models/token";
import { User } from "../models/user.model";
import { uploadToCloudinary } from "../services/upload.services";

export class ConversationController {
    private _service: ConversationServices;

  constructor(private readonly service?: ConversationServices) {
    this._service = service ?? new ConversationServices();
  }

  getConversations = async (request: Request, response: Response) => {
    try {
      const token = request.headers.authorization?.split(" ")[1];
      const now= new Date();
      if (!token) {
        return response.status(401).json({ Error: "Unauthorized" });
      }
      const tokenFind = await Token.findOne({ where: { token: token } });
      if (!tokenFind) {
        return response.status(401).json({ Error: "Invalid token" });
      }
      if(tokenFind.expiresAt && tokenFind.expiresAt> now) {
        return response.status(401).json({ Error: "Token expired" });
      }
      if (tokenFind.userId == null) {
        return response.status(401).json({ Error: "UserId not found" });
      }
      const userid = tokenFind.userId;
      if (!userid ) {
        return response.status(401).json({ Error: "Invalid UserId" });
      }
      const result = await this._service.getUserConversations(userid);
      return response.status(200).json(result);
    } catch (error) {
      return response.status(400).json({ Error: `${error}` });
    }
  };

  createGroupConversation = async (request: Request, response: Response) => {
    try {
      const token = request.headers.authorization?.split(" ")[1];
      if (!token) {
        return response.status(401).json({ Error: "Unauthorized" });
      }
      const tokenFind = await Token.findOne({ where: { token: token } });
      if (!tokenFind) {
        return response.status(401).json({ Error: "Invalid token" });
      }
      if (tokenFind.userId == null) {
        return response.status(401).json({ Error: "UserId not found" });
      }
      const userId = tokenFind.userId;
      if (!userId || isNaN(userId)) {
        return response.status(400).json({ Error: "Invalid user ID" });
      }
      if (tokenFind.expiresAt && tokenFind.expiresAt < new Date()) {
        return response.status(401).json({ Error: "Token expired" });
      }
      const data = request.body;
      if (data === null || data.length === 0) {
        return response.status(400).json({ Error: "Data not found" });
      }
      if (data.participantIds === null || data.participantIds.length === 0) {
        return response
          .status(400)
          .json({ Error: "Participant IDs not found" });
      }

      let avatarUrl= "";
      if(request.file){
        avatarUrl= await uploadToCloudinary(request.file.buffer, "groups-avatar");
      }
      const Conversation = new groupCreateRequest(data, avatarUrl);
      const result = await this._service.createGroupConversation(Conversation, userId);
      const io= request.app.get("io");
      const allMemberIds= [userId, ...data.participantIds];
      allMemberIds.forEach((item)=> {
        io.to(`user_${item}`).emit("conversationCreated", result);
      })
      return response.status(201).json(result);
    } catch (error) {
      return response.status(400).json({ Error: `${error}` });
    }
  };

  createUserConversation = async (request: Request, response: Response) => {
    try {
      const token = request.headers.authorization?.split(" ")[1];
      if (!token) {
        return response.status(401).json({ Error: "Unauthorized" });
      }
      const tokenFind = await Token.findOne({ where: { token: token } });
      if (!tokenFind) {
        return response.status(401).json({ Error: "Invalid token" });
      }
      if (tokenFind.userId == null) {
        return response.status(401).json({ Error: "UserId not found" });
      }
      
      const data = request.body;
      if (data === null) {
        return response.status(400).json({ Error: "Data not found" });
      }
      if (data.participantId === null) {
        return response
          .status(400)
          .json({ Error: "Participant IDs not found" });
      }
      
      const userId = tokenFind.userId;
      if (!userId || isNaN(userId)) {
        return response.status(400).json({ Error: "Invalid user ID" });
      }
      const userReceiver= await User.findOne({where: {id: data.participantId}});
      if (!userReceiver) {
        return response.status(400).json({ Error: "Receiver not found" });
      }
      const Conversation= new userConversationCreateRequest(data);
      const result = await this._service.gerorcreateUserConversation(Conversation, userId);
      const io= request.app.get("io");
      io.to(`user_${userId}`).emit("conversationCreated", result);
      io.to(`user_${userReceiver.id}`).emit("conversationCreated", result);
      
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
