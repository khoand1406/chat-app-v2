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

        // 3. Insert vào UsersMessages (isRead = false)
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
): Promise<CreateMessageResponse[]> {
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
        where: { userId: currentUserId },
        required: false,
        attributes: ['isRead', 'readAt']
      }
    ],
    raw: false,
    nest: true
  });
  return messages.map(msg => ({
    id: msg.id,
    conversationId: msg.conversationId,
    content: msg.content,
    sendAt: msg.sendAt,
    senderId: msg.senderId,
    sender: msg.user,
    isRead: msg.seenBy?.[0]?.isRead ?? false,
    readAt: msg.seenBy?.[0]?.readAt ?? undefined
  }));
}
async setReadMessages(currentUserId: number, conversationId:number):Promise<void>{
   const transaction = await sequelize.transaction();
    try {
        // 1. Kiểm tra user có trong conversation không
        const isParticipant = await UserConversation.findOne({
            where: { userId: currentUserId, conversationId },
            transaction
        });
        if (!isParticipant) {
            throw new Error("User is not a participant in this conversation");
        }

        // 2. Lấy tất cả tin nhắn không phải của user này
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

        
        for (const msg of messages) {
  const [record, created] = await UserMessages.findOrCreate({
    where: { userId: currentUserId, messageId: msg.id },
    defaults: {
      isRead: true,
      readAt: now
    },
    transaction
  });

  if (!created) {
    await record.update({
      isRead: true,
      readAt: now
    }, { transaction });
  }
}

        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        console.error("Error setting read messages:", error);
        throw error;
    }
}
}