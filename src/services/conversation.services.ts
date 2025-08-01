import { ConversationResponse, groupCreateRequest } from "../dtos/conversation/create-conversation.dto";
import { Conversation } from "../models/conversation.model";
import { User } from "../models/user.model";

export class ConversationServices{
    async createGroupConversation(model: groupCreateRequest): Promise<ConversationResponse>{
        
        try {
            const conversation= await Conversation.create({name: model.name, isGroup: model.isGroup, createAt: model.createAt});
            if(model.participantIds===null || model.participantIds.length===0){
                throw new Error("Invalid participants");
            }
        const userIds= await User.findAll({where: {id: model.participantIds}});
        conversation.$add("users", userIds);
        return new ConversationResponse(conversation);

        } catch (error) {
            throw Error(`Errors when update database: ${error}`)
        }
    }

    async getUserConversations(userId: number): Promise<ConversationResponse[]> {
    const user = await User.findByPk(userId, {
      include: {
        model: Conversation,
        through: { attributes: [] }, // không lấy bảng trung gian
      }
    });

    if (!user || !user.conversations) return [];

    return user.conversations.map(c => new ConversationResponse(c));
  }

 
async addUserToConversation(conversationId: number, userId: number): Promise<void> {
    
    try {
        const conversation = await Conversation.findByPk(conversationId);
        const user = await User.findByPk(userId);

    if (!conversation || !user) {
    throw new Error("Conversation or User not found");
    }

    await conversation.$add("users", user);
    } catch (error) {
        throw Error(`Errors when update database: ${error}`)
    }
  }
}
