import { AllowNull, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Conversation } from "./conversation.model";
import { User } from "./user.model";

@Table({tableName: 'Users_Conversations'})
export class UserConversation extends Model<UserConversation>{

    @Column({type: DataType.INTEGER, unique: true, primaryKey: true, autoIncrement: true, allowNull: false})
    id!:number

    @ForeignKey(()=> Conversation)
    @Column({type: DataType.INTEGER, allowNull: true})
    conversationId!: number

    @ForeignKey(()=> User)
    @Column({type:DataType.INTEGER, allowNull: true})
    userId!:number

    @Column({type:DataType.DATE, allowNull: false})
    joinAt!: Date;
    
}