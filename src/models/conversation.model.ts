import {
  Column,
  DataType,
  Model,
  Table
} from "sequelize-typescript";

@Table({ tableName: "Conversations" })  
export class Conversation extends Model {
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

}



