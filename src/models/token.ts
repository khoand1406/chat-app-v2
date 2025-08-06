import { Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { User } from "./user.model";

@Table({ tableName: "Token", timestamps: false })
export class Token extends Model {
    @Column({ type: DataType.INTEGER, allowNull: false, unique: true, autoIncrement: true, primaryKey: true })
    id!: number;

    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER, allowNull: false })
    userId!: number;
    
    @Column({ type: DataType.STRING, allowNull: false })
    token!: string;

    @Column({ type: DataType.DATE, allowNull: false, defaultValue: DataType.NOW })
    createdAt!: Date;

    @Column({ type: DataType.DATE, allowNull: true })
    expiresAt?: Date;
    
}