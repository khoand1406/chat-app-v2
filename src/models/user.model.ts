import { BelongsToMany, Column, DataType, Model, Table } from "sequelize-typescript";
import { UserAttributes, UserCreationAttributes } from "../interfaces/user.interface";


@Table({ tableName: "Users" })
export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    @Column({ type: DataType.INTEGER, allowNull: false, unique: true, autoIncrement: true, primaryKey: true })
    id!: number;

    @Column({ type: DataType.STRING, allowNull: false })
    userName!: string;

    @Column({ type: DataType.STRING, allowNull: false })
    email!: string;

    @Column({ type: DataType.STRING, allowNull: false })
    passwordHash!: string;

    @Column({ type: DataType.STRING, allowNull: true })
    avatarUrl?: string;

}
