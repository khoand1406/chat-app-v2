import { Optional } from "sequelize";

export interface ConversationAttribute {
    id: number;
    name?: string;
    isGroup: boolean;
    createdAt: Date;
}

export type ConversationCreationAttribute = Optional<ConversationAttribute, "id" | "name" | "createdAt">;
