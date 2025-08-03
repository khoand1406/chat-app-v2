import { conversationCreateRequest, ConversationResponse, groupCreateRequest } from "../dtos/conversation/create-conversation.dto";
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
        if (userIds.length !== model.participantIds.length) {
          throw new Error("Some participant IDs are invalid.");
        }
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
        through: { attributes: [] },
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
async getUsersConversation(conversationId: number, userId: number):Promise<ConversationResponse[]>{
  try {
    const conversation= await Conversation.findAll( 
      {where: {
        id: conversationId
      },
        include: {
        model: User,
        where:{
          id: userId
        },
        through: {
          attributes: []
        },
        attributes:['id', 'userName']
      } 
    });
    return conversation.map(item=> new ConversationResponse(item));

  } catch (error) {
    throw Error(`Failed: ${error}`);
  }
}

async createUserConversation(model: conversationCreateRequest): Promise<ConversationResponse>{
  try {
    const conversation= Conversation.create({name: model.name, isGroup: false, createAt: model.createAt});
    if(model.participantIds.length===0 || model.participantIds===null){
      throw Error("Invalid participants");
    }
    if(model.participantIds.length> 2){
      throw Error("Invalid join participants")
    }
    const users= await User.findAll({where: {id: model.participantIds}});
    (await conversation).$add("users", users);
    return new ConversationResponse(conversation);
  } catch (error) {
    throw new Error(`Error: ${error}`)
  }
}

async deleteGroupConversation(conversationId: number): Promise<void>{
  try {
    const conversation= await Conversation.findByPk(conversationId);
    if(conversation===null){
      throw Error("Conversation not found");
    }

  } catch (error) {
    
  }
}

}




