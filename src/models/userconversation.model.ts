import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from './user.model';
import { Conversation } from './conversation.model';

@Table({ tableName: 'Users_Conversations', timestamps: false })
export class UserConversation extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  })
  id!: number;

@ForeignKey(() => Conversation)
@Column({ type: DataType.INTEGER, allowNull: false }) // ✅ KHÔNG nullable
conversationId!: number;

@ForeignKey(() => User)
@Column({ type: DataType.INTEGER, allowNull: false }) // ✅ KHÔNG nullable
userId!: number;

  @Column({ type: DataType.DATE, allowNull: false })
  joinAt!: Date;
}
