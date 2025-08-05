import {
  BelongsToMany,
  Column,
  DataType,
  HasMany,
  Model,
  Table
} from "sequelize-typescript";
import { ConversationAttribute, ConversationCreationAttribute } from "../interfaces/conversation.interface";
import { Message } from "./message.model";
import { User } from "./user.model";
import { UserConversation } from "./userconversation.model";

@Table({ tableName: "Conversation", timestamps: false })  
export class Conversation extends Model<ConversationAttribute, ConversationCreationAttribute> implements ConversationAttribute {
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



