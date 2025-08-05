import { sequelize } from "../database/config";
import { conversationCreateRequest, ConversationResponse, groupCreateRequest } from "../dtos/conversation/create-conversation.dto";
import { ConversationCreationAttribute } from "../interfaces/conversation.interface";
import { Conversation } from "../models/conversation.model";
import { User } from "../models/user.model";
import { UserConversation } from "../models/userconversation.model";
import { formatDateToSQL } from "../utils/dateFormatter";

export class ConversationServices{
    async createGroupConversation(model: groupCreateRequest): Promise<ConversationResponse>{
        
        try {
            const conversation= await Conversation.create({name: model.name, isGroup: model.isGroup, createdAt: model.createAt});
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

async createUserConversation(model: conversationCreateRequest): Promise<ConversationResponse> {
  const transaction = await sequelize.transaction();
  try {
    if (!model.participantIds || model.participantIds.length === 0) {
      throw new Error("Invalid participants");
    }

    const payload: ConversationCreationAttribute = {
      name: model.name || "",
      isGroup: model.isGroup,
      createdAt: new Date(),
    };

    const conversation = await Conversation.create(payload, { transaction });

    // Ensure conversation is created and has a valid id
    if (!conversation || !conversation.id) {
      throw new Error("Conversation creation failed");
    }

    const users = await User.findAll({
      where: { id: model.participantIds },
      transaction,
    });

    if (users.length !== model.participantIds.length) {
      throw new Error("One or more userIds are invalid");
    }

    await UserConversation.bulkCreate(
      users.map((user) => ({
        conversationId: conversation.id,
        userId: user.id,
        joinAt: new Date(),
      })),
      { transaction }
    );

    await transaction.commit();

    return new ConversationResponse(conversation);
  } catch (error: any) {
    await transaction.rollback();
    console.error("💥 Sequelize error:", error.message);
    if (error.original) {
      console.error("Original SQL error:", error.original.message);
    }
    throw new Error(`❌ Sequelize Error: ${error.message}`);
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




