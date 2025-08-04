import { Conversation } from "./conversation.model";
import { User } from "./user.model";
import { UserConversation } from "./userconversation.model";


export function associateModels() {
  User.belongsToMany(Conversation, {
    through: UserConversation,
    foreignKey: "userId",
    otherKey: "conversationId",
  });

  Conversation.belongsToMany(User, {
    through: UserConversation,
    foreignKey: "conversationId",
    otherKey: "userId",
  });
}
