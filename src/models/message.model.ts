import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Conversation } from "./conversation.model";
import { User } from "./user.model";
import { CreateMessageAttribute, MessageAttributes } from "../interfaces/message.interface";


@Table
export class Message extends Model<MessageAttributes, CreateMessageAttribute>{
    @Column({type: DataType.INTEGER, primaryKey: true, unique: true, allowNull: false, autoIncrement: false})
    id!: number

    @ForeignKey(()=> Conversation)
    @Column({type: DataType.INTEGER, allowNull: true})
    conversationId!: number

    @ForeignKey(()=> User)
    @Column({type: DataType.INTEGER, allowNull: true})
    senderId!: number

    @Column({type: DataType.STRING, allowNull: false})
    content!: string

    @Column({type: DataType.DATE, allowNull: false})
    sendAt!: Date

    @BelongsTo(()=> Conversation)
    conversation!: Conversation

    @BelongsTo(()=> User)
    user!:User



    
}