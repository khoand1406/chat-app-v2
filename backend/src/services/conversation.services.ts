import { sequelize } from "../database/config";
import {
  ConversationResponse,
  groupCreateRequest,
  userConversationCreateRequest,
} from "../dtos/conversation/create-conversation.dto";
import { ConversationCreationAttribute } from "../interfaces/conversation.interface";
import { Conversation } from "../models/conversation.model";
import { Message } from "../models/message.model";
import { User } from "../models/user.model";
import { UserConversation } from "../models/userconversation.model";
import { UserMessages } from "../models/usermessages";
import { Op } from "sequelize";

export class ConversationServices {
  async createGroupConversation(
    model: groupCreateRequest,
    currentUserId: number
  ): Promise<ConversationResponse> {
    const transaction = await sequelize.transaction();
    try {
      let participantIds: number[] = [];

      if (typeof model.participantIds === "string") {
        try {
          participantIds = JSON.parse(model.participantIds);
        } catch {
          throw new Error("Invalid participantIds format (must be JSON array)");
        }
      } else if (Array.isArray(model.participantIds)) {
        participantIds = model.participantIds;
      } else {
        throw new Error("participantIds must be an array or JSON string");
      }

      const participantsId = [...new Set([...participantIds, currentUserId])]
        .map((id) => Number(id))
        .filter((id) => !isNaN(id));

      if (participantsId.length < 3) {
        throw new Error("Group conversation must have at least 3 participants");
      }

      const existingConversations = await Conversation.findAll({
        where: { isGroup: true },
        include: [
          {
            model: User,
            where: { id: participantsId },
            through: { attributes: [] },
          },
        ],
        transaction,
      });

      for (const conv of existingConversations) {
        const users = await conv.$get("users", { transaction });
        const userIds = users.map((u) => u.id).sort();
        if (
          JSON.stringify(userIds) === JSON.stringify([...participantsId].sort())
        ) {
          await transaction.rollback();
          return new ConversationResponse(conv); // nhóm đã tồn tại
        }
      }

      const payload: ConversationCreationAttribute = {
        name: model.name || "",
        isGroup: true,
        createdAt: new Date(),
        avatarUrl: model.avatarUrl || "",
      };

      const conversation = await Conversation.create(payload, { transaction });

      if (!conversation || !conversation.id) {
        throw new Error("Conversation creation failed");
      }

      const users = await User.findAll({
        where: { id: participantsId },
        transaction,
      });

      if (users.length !== participantsId.length) {
        throw new Error("Some participant IDs are invalid");
      }
      await conversation.$add("users", users, { transaction });

      await transaction.commit();
      return new ConversationResponse(conversation);
    } catch (error) {
      console.error("Error creating group conversation:", error);
      await transaction.rollback();
      throw new Error(
        `Error creating group conversation: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  async getUserConversations(userId: number): Promise<ConversationResponse[]> {
    const user = await User.findByPk(userId, {
      include: [
        {
          model: Conversation,
          through: { attributes: [] },
          include: [
            {
              model: User,
              attributes: ["id", "userName", "avatarUrl"],
              through: { attributes: [] },
            },
            {
              model: Message,
              include: [
                {
                  model: User,
                  attributes: ["id", "userName", "avatarUrl"],
                },
              ],
              separate: true,
              order: [["sendAt", "DESC"]],
              limit: 1,
            },
          ],
        },
      ],
    });

    if (!user || !user.conversations) return [];

    const conversationsWithUnread = await Promise.all(
      user.conversations.map(async (conversation) => {
        let displayName = conversation.name || "";
        let avatarUrl = conversation.avatarUrl || "";

        if (!conversation.isGroup) {
          const otherUser = conversation.users?.find((u) => u.id !== userId);
          if (otherUser) {
            displayName = otherUser.userName;
            avatarUrl = otherUser.avatarUrl || "";
          }
        }

        const lastMessage = conversation.messages?.[0] || null;
        const lastMessageContent = lastMessage ? lastMessage.content : "";
        const timestamp = lastMessage?.sendAt
          ? lastMessage.sendAt.toISOString()
          : "";

        // Lấy unreadCount từ UserMessages
        const unreadCount = await UserMessages.count({
          where: {
            userId: userId,
            isRead: false,
            messageId: {
              [Op.in]: sequelize.literal(`(
              SELECT id FROM Messages WHERE conversationId = ${conversation.id}
            )`),
            },
          },
        });

        const lastUserSent = lastMessage?.user.id | 0;
        const lastUser= await User.findByPk(lastUserSent);
        const lastUserName= lastUser?.userName;


        return {
          ...new ConversationResponse(
            conversation.get(),
            displayName,
            avatarUrl,
            lastMessageContent,
            timestamp,
            lastUserSent,
            lastUserName
          ),
          unreadCount,
        };
      })
    );

    // Sort: unread > 0 lên trước, sau đó theo timestamp mới nhất
    return conversationsWithUnread.sort((a, b) => {
      if (a.unreadCount > 0 && b.unreadCount === 0) return -1;
      if (a.unreadCount === 0 && b.unreadCount > 0) return 1;
      return (
        new Date(b.timestamp || 0).getTime() -
        new Date(a.timestamp || 0).getTime()
      );
    });
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

  async gerorcreateUserConversation(
    model: userConversationCreateRequest,
    currentUserId: number
  ): Promise<ConversationResponse> {
    const transaction = await sequelize.transaction();
    try {
      const { participantId } = model;
      if (!model.participantId) {
        throw new Error("Invalid participants");
      }
      const userConversations = await UserConversation.findAll({
        where: { userId: currentUserId },
        include: [Conversation],
        transaction,
      });

      const targetUser = await User.findByPk(participantId, { transaction });
      if (!targetUser) {
        throw new Error("Invalid target");
      }

      for (const uc of userConversations) {
        const conversation = await Conversation.findOne({
          where: {
            id: uc.conversationId,
            isGroup: false,
          },
          transaction,
        });

        if (!conversation) continue;

        const otherParticipant = await UserConversation.findOne({
          where: {
            conversationId: uc.conversationId,
            userId: participantId,
          },
          transaction,
        });

        if (otherParticipant) {
          return new ConversationResponse(conversation, targetUser.userName);
        }
      }

      const payload: ConversationCreationAttribute = {
        name: "",
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
