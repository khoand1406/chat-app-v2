import { Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Message } from "./message.model";
import { User } from "./user.model";

@Table({ tableName: "UsersMessages", timestamps: false })
export class UserMessages extends Model{

    @Column({ type: DataType.INTEGER ,primaryKey: true, allowNull: false, autoIncrement: true , unique: true })
    id!: number;

    
    @Column({ type: DataType.INTEGER, allowNull: false })
    @ForeignKey(() => User)
    userId!: number;

    @ForeignKey(()=> Message)
    @Column({ type: DataType.INTEGER, allowNull: false })
    messageId!: number;

    @Column({type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
    isRead!: boolean;

    @Column({ type: DataType.DATE, allowNull: true, defaultValue: DataType.NOW })
    readAt?: Date;

}