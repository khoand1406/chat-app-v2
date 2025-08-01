import { Optional } from "sequelize";
export interface ConversationAttribute{
    id?: number,
    name?: string
    isGroup: boolean
    createAt: Date
}

export type ConversationCreationAttribute= Optional<ConversationAttribute, "id">