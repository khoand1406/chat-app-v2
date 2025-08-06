import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { CreateMessageAttribute, MessageAttributes } from "../interfaces/message.interface";
import { Conversation } from "./conversation.model";
import { User } from "./user.model";
import { UserMessages } from "./usermessages";


@Table({ tableName: "Messages" , timestamps: false })
export class Message extends Model<MessageAttributes, CreateMessageAttribute>{
    @Column({type: DataType.INTEGER, primaryKey: true, unique: true, allowNull: false, autoIncrement: true})
    id!: number

    @ForeignKey(()=> Conversation)
    @Column({type: DataType.INTEGER, allowNull: false})
    conversationId!: number

    @ForeignKey(()=> User)
    @Column({type: DataType.INTEGER, allowNull: false})
    senderId!: number

    @Column({type: DataType.STRING, allowNull: false})
    content!: string

    @Column({type: DataType.DATE, allowNull: false, defaultValue: DataType.NOW})
    sendAt!: Date
    
    @BelongsTo(()=> Conversation)
    conversation!: Conversation

    @BelongsTo(()=> User)
    user!:User

    @HasMany(() => UserMessages)
    seenBy!: UserMessages[];

}

