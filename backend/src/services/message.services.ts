import { sequelize } from "../database/config";
import { CreateMessageRequest, CreateMessageResponse } from "../dtos/messsages/create-message.dto";
import { Conversation } from "../models/conversation.model";
import { Message } from "../models/message.model";
import { User } from "../models/user.model";
import { UserConversation } from "../models/userconversation.model";
import { UserMessages } from "../models/usermessages";
import { Op } from "sequelize";

export class MessageService{
    async sendMessage(model: CreateMessageRequest): Promise<CreateMessageResponse>{
        if (!model.content || !model.conversationId || !model.senderId) {
            throw new Error("Invalid message data");
        }
        
        const transaction = await sequelize.transaction();
        try {

            const userExists = await User.findByPk(model.senderId, { transaction });
            if (!userExists) {
                throw new Error("Sender does not exist");
            }   
            const conversationExists = await Conversation.findOne({
                where: { id: model.conversationId },
                transaction
            });
            if (!conversationExists) {
                throw new Error("Conversation does not exist");
            }
            const userConversations = await UserConversation.findAll({where: {userId: model.senderId, conversationId: model.conversationId}, transaction});
            if (!userConversations || userConversations.length === 0) {
                throw new Error("User is not a participant in this conversation");
            }

            const message= await Message.create({content: model.content
                                                , conversationId: model.conversationId
                                                , senderId: model.senderId
                                                , sendAt: new Date()}, {transaction});
            if (!message) {
                throw new Error("Message creation failed");
            }   
            
            if (!message.id) {
                throw new Error("Message ID not found after creation");
            }
             const participants = await UserConversation.findAll({
            where: {
                conversationId: model.conversationId,
                userId: { [Op.ne]: model.senderId }
            },
            transaction
        });

       
        const userMessagesData = participants.map(p => ({
            userId: p.userId,
            messageId: message.id,
            isRead: false,
            readAt: null
        }));

        if (userMessagesData.length > 0) {
            await UserMessages.bulkCreate(userMessagesData, { transaction });
        }

        await transaction.commit();

        return new CreateMessageResponse(message);

        } catch (error) {
            console.error("Error sending message:", error);
            await transaction.rollback();
            if (error instanceof Error) {
                throw new Error(`Error sending message: ${error.message}`);
            }
            
            console.error("Unexpected error:", error);
            throw Error(`Database update error: ${error}`)

        }
    }

   async getMessageByConversation(
  conversationId: number,
  currentUserId: number
): Promise<any[]> {
  const messages = await Message.findAll({
    where: { conversationId },
    order: [['sendAt', 'ASC']],
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

  return messages.map(msg => {
    
    const seenUsers = msg.seenBy
      ?.filter(um => um.isRead)
      ?.map(um => ({
        id: um.user.id,
        userName: um.user.userName,
        avatarUrl: um.user.avatarUrl,
        readAt: um.readAt
      })) || [];

    
    const currentUserRead = seenUsers.some(u => u.id === currentUserId);

    return {
      id: msg.id,
      conversationId: msg.conversationId,
      content: msg.content,
      sendAt: msg.sendAt,
      senderId: msg.senderId,
      user: msg.user,
      isRead: currentUserRead,
      seenBy: seenUsers
    };
  });
}
async setReadMessages(currentUserId: number, conversationId: number): Promise<void> {
    const transaction = await sequelize.transaction();
    try {
        
        const isParticipant = await UserConversation.findOne({
            where: { userId: currentUserId, conversationId },
            transaction
        });
        if (!isParticipant) {
            throw new Error("User is not a participant in this conversation");
        }

        
        const messages = await Message.findAll({
            where: {
                conversationId,
                senderId: { [Op.ne]: currentUserId }
            },
            transaction
        });

        if (messages.length === 0) {
            await transaction.commit();
            return;
        }

        const now = new Date();
        const messageIds = messages.map(m => m.id);

        
        const existingRecords = await UserMessages.findAll({
            where: {
                userId: currentUserId,
                messageId: messageIds
            },
            transaction
        });

        const existingMap = new Map(existingRecords.map(e => [e.messageId, e]));
        const updates: Promise<any>[] = [];
        const inserts: any[] = [];

        for (const msg of messages) {
            const existing = existingMap.get(msg.id);
            if (existing) {
                if (!existing.isRead) {
                    updates.push(
                        existing.update({ isRead: true, readAt: now }, { transaction })
                    );
                }
            } else {
                inserts.push({
                    userId: currentUserId,
                    messageId: msg.id,
                    isRead: true,
                    readAt: now
                });
            }
        }

        
        if (inserts.length > 0) {
            await UserMessages.bulkCreate(inserts, { transaction });
        }

        
        if (updates.length > 0) {
            await Promise.all(updates);
        }

        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        console.error("Error setting read messages:", error);
        throw error;
    }
}
}