import { AllowNull, BelongsToMany, Column, DataType, Model, Table } from "sequelize-typescript";
import { User } from "./user.model";
import { UserConversation } from "./userconversation.model";
import { ConversationAttribute, ConversationCreationAttribute } from "../interfaces/conversation.interface";

@Table
export class Conversation extends Model<ConversationAttribute, ConversationCreationAttribute>{

    @Column({type: DataType.INTEGER, primaryKey: true, allowNull: false, unique: true, autoIncrement: true})
    id!: number;

    @Column({type: DataType.STRING, allowNull: true})
    Name?: string;

    @Column({type: DataType.BOOLEAN, allowNull: false })
    isGroup!:boolean;

    @Column({type:DataType.DATE, allowNull: false})
    createdAt!: Date;

    @BelongsToMany(()=> User, ()=> UserConversation)
    users!: User[];

}