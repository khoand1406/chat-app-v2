import { Optional } from "sequelize";
export interface UserAttributes{
    id: number
    userName: string
    email: string
    passwordHash: string
    avatarUrl?: string
}

export type UserCreationAttributes= Optional<UserAttributes, "id">

export interface UserConversationAttributes {
  id: number;
  conversationId: number;
  userId: number;
  joinAt: Date;
}