import {
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  HasMany,
  Model,
  Table
} from "sequelize-typescript";
import { Message } from "./message.model";
import { User } from "./user.model";
import { UserConversation } from "./userconversation.model";
import { ConversationAttribute } from "../interfaces/conversation.interface";

@Table({ tableName: "Conversations" })  
export class Conversation extends Model<ConversationAttribute> implements ConversationAttribute {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    allowNull: false,
    unique: true,
    autoIncrement: true,
  })
  id!: number;

  @Column({ type: DataType.STRING, allowNull: true })
  name?: string;

  @Column({ type: DataType.BOOLEAN, allowNull: false })
  isGroup!: boolean;

  @Column({ type: DataType.DATE, allowNull: false })
  createdAt!: Date;

  @HasMany(() => Message)
  messages!: Message[];

  @BelongsToMany(() => User, () => UserConversation)
  users!: User[];

}



