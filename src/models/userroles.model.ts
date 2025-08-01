import { Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Role } from "./role.model";
import { User } from "./user.model";

@Table({tableName: "User_Roles"})
export class UserRoles extends Model<UserRoles>{

    @Column({type: DataType.INTEGER, primaryKey: true, unique: true, allowNull: false, autoIncrement: false })
    id!: number

    @ForeignKey(() => User)
    @Column({type: DataType.INTEGER, allowNull: true })
    userId!: number;

    @ForeignKey(() => Role)
    @Column({type: DataType.INTEGER, allowNull: true})
    roleId!: number;

}
