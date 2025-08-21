import { AutoIncrement, Column, DataType, HasMany, Model, PrimaryKey, Table } from "sequelize-typescript";
import { Attendance } from "./attendence.model";

@Table
export class Events extends Model{

    @PrimaryKey
    @AutoIncrement
    @Column({type: DataType.INTEGER, allowNull: false})
    id!: number;

    @Column({type: DataType.STRING, allowNull: false})
    content!: string

    @Column({type: DataType.STRING, allowNull: false})
    description!:string

    @Column({type: DataType.DATE, allowNull: false, defaultValue: DataType.NOW})
    startDate!:Date

    @Column({type: DataType.DATE, allowNull: false, defaultValue: DataType.NOW})
    endDate!:Date

    @HasMany(() => Attendance)
    attendances!: Attendance[];

}