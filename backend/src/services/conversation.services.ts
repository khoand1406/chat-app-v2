import { sequelize } from "../database/config";
import {
  ConversationResponse,
  groupCreateRequest,
  userConversationCreateRequest
} from "../dtos/conversation/create-conversation.dto";
import { ConversationCreationAttribute } from "../interfaces/conversation.interface";
import { Conversation } from "../models/conversation.model";
import { User } from "../models/user.model";
import { UserConversation } from "../models/userconversation.model";

export class ConversationServices {
  async createGroupConversation(
    model: groupCreateRequest,
    currentUserId:number
  ): Promise<ConversationResponse> {
    const transaction = await sequelize.transaction();
    try {
      if (!model.participantIds || model.participantIds.length === 0) {
        throw new Error("Invalid participants");
      }
      const participantsId = [...new Set([...model.participantIds, currentUserId])];
      
      if (participantsId.length < 3) {
        throw new Error("Group conversation must have at least 3 participants");
      }
      const existingConversations = await Conversation.findAll({
  where: { isGroup: true },
  include: [
    {
      model: User,
      where: { id: participantsId },
      through: { attributes: [] }
    }
  ],
  transaction,
});

for (const conv of existingConversations) {
  const users = await conv.$get("users", { transaction });
  const userIds = users.map(u => u.id).sort();
  if (JSON.stringify(userIds) === JSON.stringify(participantsId.sort())) {
    await transaction.rollback();
    return new ConversationResponse(conv); // đã tồn tại -> trả về
  }
}
      const payload: ConversationCreationAttribute = {
        name: model.name || "",
        isGroup: model.isGroup,
        createdAt: new Date(),
      };

      const conversation = await Conversation.create(payload, { transaction });

      if (!conversation || !conversation.id) {
        throw new Error("Conversation creation failed");
      }

      const userIds = await User.findAll({
        where: { id: participantsId },
        transaction,
      });
      if (userIds.length !== model.participantIds.length) {
        throw new Error("Some participant IDs are invalid.");
      }

      await conversation.$add("users", userIds, { transaction });

      await transaction.commit();
      if (!conversation) {
        throw new Error("Conversation creation failed");
      }
      return new ConversationResponse(conversation);
    } catch (error) {
      console.error("Error creating group conversation:", error);
      await transaction.rollback();
      if (error instanceof Error) {
        throw new Error(`Error creating group conversation: ${error.message}`);
      } else {
        throw new Error(
          "An unexpected error occurred while creating the group conversation."
        );
      }
    }
  }

  async getUserConversations(userId: number): Promise<ConversationResponse[]> {
    const user = await User.findByPk(userId, {
      include: {
        model: Conversation,
        through: { attributes: [] },
      },
    });

    if (!user || !user.conversations) return [];

    return user.conversations.map((c) => new ConversationResponse(c));
  }

  async addUserToConversation(
    conversationId: number,
    userId: number
  ): Promise<void> {
    try {
      const conversation = await Conversation.findByPk(conversationId);
      const user = await User.findByPk(userId);

      if (!conversation || !user) {
        throw new Error("Conversation or User not found");
      }

      await conversation.$add("users", user);
    } catch (error) {
      throw Error(`Errors when update database: ${error}`);
    }
  }
  async getUsersConversation(
    conversationId: number,
    userId: number
  ): Promise<ConversationResponse[]> {
    try {
      const conversation = await Conversation.findAll({
        where: {
          id: conversationId,
        },
        include: {
          model: User,
          where: {
            id: userId,
          },
          through: {
            attributes: [],
          },
          attributes: ["id", "userName"],
        },
      });
      return conversation.map((item) => new ConversationResponse(item));
    } catch (error) {
      throw Error(`Failed: ${error}`);
    }
  }

  async gerorcreateUserConversation(
    model: userConversationCreateRequest,
    currentUserId: number
  ): Promise<ConversationResponse> {
    const transaction = await sequelize.transaction();
    try {
      const { participantId, isGroup } = model;
      if (!model.participantId) {
        throw new Error("Invalid participants");
      }
      const userConversations = await UserConversation.findAll({
    where: { userId: currentUserId },
    include: [Conversation]
  });

    const targetUser= await User.findByPk(participantId);
    if(!targetUser){
      throw new Error("Invalid target");
    }
    for (const uc of userConversations) {
    
    const otherParticipant = await UserConversation.findOne({
      where: {
        conversationId: uc.conversationId,
        userId: participantId
      }
    });

    if (otherParticipant) {
      // Found existing 1-1 conversation
      return new ConversationResponse(uc.conversation, targetUser.userName);
    }
  }

      const payload: ConversationCreationAttribute = {
        name:  "",
        isGroup: model.isGroup,
        createdAt: new Date(),
      };

      const conversation = await Conversation.create(payload, { transaction });

      if (!conversation || !conversation.id) {
        throw new Error("Conversation creation failed");
      }

       await UserConversation.bulkCreate(
      [
        {
          userId: currentUserId,
          conversationId: conversation.id,
          joinAt: new Date(),
        },
        {
          userId: participantId,
          conversationId: conversation.id,
          joinAt: new Date(),
        },
      ],
      { transaction }
    );

      await transaction.commit();

      return new ConversationResponse(conversation, targetUser.userName);
    } catch (error: any) {
      await transaction.rollback();
      console.error("Error:", error.message);
      if (error.original) {
        console.error("Original SQL error:", error.original.message);
      }
      throw new Error(`Error: ${error.message}`);
    }
  }

  async deleteGroupConversation(conversationId: number): Promise<void> {
    try {
      const conversation = await Conversation.findByPk(conversationId);
      if (conversation === null) {
        throw Error("Conversation not found");
      }
    } catch (error) {}
  }
}
