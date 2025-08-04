import {
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';

@Table
export class UserConversation extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  })
  id!: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  userId!: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  conversationId!: number;

  @Column({ type: DataType.DATE, allowNull: false })
  joinAt!: Date;
}
