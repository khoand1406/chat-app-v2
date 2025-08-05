import { BelongsTo, BelongsToMany, Column, DataType, Model, Table } from "sequelize-typescript";
import { User } from "./user.model";
import { UserRoles } from "./userroles.model";

@Table({ tableName: "Roles" , timestamps: false })
export class Role extends Model{
    @Column({type: DataType.INTEGER, allowNull: false, unique: true, primaryKey: true, autoIncrement: true})
    id!: number

    @Column({type: DataType.STRING, allowNull: false})
    roleName!: string

    @BelongsToMany(() => User, () => UserRoles)
    users!: User[];
}