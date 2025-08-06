import { Optional } from "sequelize";
export interface MessageAttributes{
    id: number
    conversationId: number
    senderId: number
    content: string
    sendAt: Date
}

export type CreateMessageAttribute= Optional<MessageAttributes, "id">