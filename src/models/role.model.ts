import { BelongsTo, BelongsToMany, Column, DataType, Model, Table } from "sequelize-typescript";

@Table({ tableName: "Roles" })
export class Role extends Model{
    @Column({type: DataType.INTEGER, allowNull: false, unique: true, primaryKey: true, autoIncrement: true})
    id!: number

    @Column({type: DataType.INTEGER, allowNull: false})
    roleName!: string

    
}