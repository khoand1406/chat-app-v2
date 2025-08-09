import { sequelize } from "../database/config";
import { CreateMessageRequest, CreateMessageResponse } from "../dtos/messsages/create-message.dto";
import { Conversation } from "../models/conversation.model";
import { Message } from "../models/message.model";
import { User } from "../models/user.model";
import { UserConversation } from "../models/userconversation.model";
import { UserMessages } from "../models/usermessages";

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
            await transaction.commit();
            if (!message.id) {
                throw new Error("Message ID not found after creation");
            }
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
    where: {
      conversationId: conversationId
    },
    order: [['sendAt', 'ASC']],
    include: [
      // Lấy thông tin người gửi
      {
        model: User, 
        attributes: ['id', 'userName', 'avatarUrl']
      },
      // Lấy trạng thái đọc tin của currentUser
      {
        model: UserMessages,
        where: {
          userId: currentUserId
        },
        required: false,
        attributes: ['isRead', 'readAt']
      }
    ]
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
}