import { Request, Response } from "express";
import { CreateMessageRequest } from "../dtos/messsages/create-message.dto";
import { MessageService } from "../services/message.services";
import { sequelize } from "../database/config";
import { Token } from "../models/token";
import { UserConversation } from "../models/userconversation.model";
import { Conversation } from "../models/conversation.model";
import { error } from "console";
import { Message } from "../models/message.model";
import { User } from "../models/user.model";
import { UserMessages } from "../models/usermessages";
import { NotificationServices } from "../services/notification.services";
import { NotificationCreateRequest } from "../interfaces/notification.interface";
export class MessageController {
  private _messageService: MessageService;
  private _notificationService: NotificationServices
  constructor(private readonly messageService?: MessageService, private readonly notificationService?: NotificationServices) {
    this._messageService = messageService ?? new MessageService();
    this._notificationService= notificationService ?? new NotificationServices();
  }

  sendMessage = async (request: Request, response: Response) => {
    try {
      const token = request.headers.authorization?.split(" ")[1];
      if (!token) {
        return response
          .status(401)
          .json({ status: "failed", error: "Unauthorized" });
      }
      const tokenFind = await Token.findOne({ where: { token: token } });
      if (!tokenFind) {
        return response
          .status(401)
          .json({ status: "failed", error: "Invalid token" });
      }

      const userId = tokenFind.userId;
      if (!userId || isNaN(userId)) {
        return response
          .status(400)
          .json({ status: "failed", error: "Invalid user ID" });
      }

      const data = request.body;
      if (!data || Object.keys(data).length === 0) {
        return response
          .status(400)
          .json({ status: "failed", error: "Data not found" });
      }
      if (!data.content || !data.conversationId) {
        return response
          .status(400)
          .json({ status: "failed", error: "Invalid message data" });
      }
      const userConversation = await UserConversation.findOne({
        where: {
          userId: userId,
          conversationId: data.conversationId,
        },
      });
      if (!userConversation) {
        return response
          .status(403)
          .json({
            status: "failed",
            error: "User is not a participant in this conversation",
          });
      }
      const conversation = await Conversation.findByPk(data.conversationId);
      const messageDto = new CreateMessageRequest(data, userId);

      const result = await this._messageService.sendMessage(messageDto);
      const fullMessage = await Message.findByPk(result.id, {
    include: [
        {
            model: User,
            attributes: ['id', 'userName', 'avatarUrl']
        },
        {
            model: UserMessages,
            as: 'seenBy',
            required: false,
            include: [
                {
                    model: User,
                    attributes: ['id', 'userName', 'avatarUrl']
                }
            ]
        }
    ]
});

      const io = request.app.get("io");

      if (conversation?.isGroup) {
        const members = await UserConversation.findAll({
          where: { conversationId: conversation.id },
          attributes: ["userId"],
        });
        const allMemberIds = members.map((m) => m.userId);
        allMemberIds.forEach((uid) =>
          io.to(`user_${uid}`).emit("messageSent", fullMessage)
        );
        await this._notificationService.sendUsersNotification(allMemberIds, {title: "New message",
    content: `${fullMessage?.user.userName}: ${fullMessage?.content}`,
    userId: userId, createdAt: new Date(),})
      } else {
        const members= await UserConversation.findAll({where: {conversationId: conversation?.id},
        attributes: ['userId']});
        const allMemberIds= members.map(item=> item.userId);
        allMemberIds.forEach(element => {
            io.to(`user_${element}`).emit("messageSent", fullMessage);
        });
        await this._notificationService.sendUsersNotification(allMemberIds, {title: "New message",
    content: `${fullMessage?.user.userName}: ${fullMessage?.content}`,
    userId: 0, createdAt: new Date()})
      }
      
      return response.status(201).json(fullMessage);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      return response
        .status(400)
        .json({ status: "failed", error: errorMessage });
    }
  };

  getMessages = async (request: Request, response: Response) => {
    try {
      const token = request.headers.authorization?.split(" ")[1];
      if (!token) {
        return response
          .status(401)
          .json({ status: "failed", error: "Unauthorized" });
      }
      const conversationId = request.params.id;
      const tokenFind = await Token.findAll({ where: { token: token } });
      if (!tokenFind || tokenFind.length === 0) {
        return response
          .status(401)
          .json({ status: "failed", error: "Invalid token" });
      }
      const currentUserId = tokenFind[0].userId;
      if (!conversationId || isNaN(parseInt(conversationId))) {
        return response
          .status(400)
          .json({ status: "failed", error: "Invalid conversation ID" });
      }
      if (!currentUserId || isNaN(currentUserId)) {
        return response
          .status(400)
          .json({ status: "failed", error: "Invalid user ID" });
      }
      const UserInConversation = await UserConversation.findOne({
        where: {
          userId: currentUserId,
          conversationId: parseInt(conversationId),
        },
      });
      if (!UserInConversation) {
        return response
          .status(403)
          .json({
            status: "failed",
            error: "User is not a participant in this conversation",
          });
      }
      const result = await this._messageService.getMessageByConversation(
        parseInt(conversationId),
        currentUserId
      );
      return response.status(200).json(result);
    } catch (error) {
      return response.status(400).json({ status: "failed", error: error });
    }
  };

  readMessages=  async (request:Request, response: Response)=> {
    try {
      const token = request.headers.authorization?.split(" ")[1];
      if(!token) return response.status(401).json({status: "failed", error: "Token not found"});
      const {conversationId} = request.body;
      
      const convId= parseInt(conversationId);
      const tokenFind = await Token.findAll({ where: { token: token } });
      if (!tokenFind || tokenFind.length === 0) {
        return response
          .status(401)
          .json({ status: "failed", error: "Invalid token" });
      }
      const currentUserId = tokenFind[0].userId;
      if (!conversationId || isNaN(parseInt(conversationId))) {
        return response
          .status(400)
          .json({ status: "failed", error: "Invalid conversation ID" });
      }
      if (!currentUserId || isNaN(currentUserId)) {
        return response
          .status(400)
          .json({ status: "failed", error: "Invalid user ID" });
      }
      
      const UserInConversation = await UserConversation.findOne({
        where: {
          userId: currentUserId,
          conversationId: parseInt(conversationId),
        },
      });
      if (!UserInConversation) {
        return response
          .status(403)
          .json({
            status: "failed",
            error: "User is not a participant in this conversation",
          });
      }
      
      this._messageService.setReadMessages(currentUserId, convId);
      return response.status(200).json({status: "success"});
    } catch (error) {
      return response.status(400).json({ status: "failed", error: error });
    }
  }
}
