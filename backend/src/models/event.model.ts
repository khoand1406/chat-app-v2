import { AllowNull, AutoIncrement, Column, DataType, ForeignKey, HasMany, Model, PrimaryKey, Table } from "sequelize-typescript";
import { Attendance } from "./attendence.model";
import { User } from "./user.model";

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

    @Column({type: DataType.NUMBER, allowNull: false})
    @ForeignKey(()=> User)
    creatorId!: number

    @HasMany(() => Attendance)
    attendances!: Attendance[];

}