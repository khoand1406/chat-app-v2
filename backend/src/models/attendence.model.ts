import { AutoIncrement, BelongsTo, Column, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import { User } from "./user.model";
import { Events } from "./event.model";
import { AttendanceAttributes, AttendanceCreateAttribute } from "../interfaces/attendence.interface";

@Table
export class Attendance extends Model<AttendanceAttributes, AttendanceCreateAttribute> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @ForeignKey(() => User)
  @Column
  userId!: number;

  @ForeignKey(() => Events)
  @Column
  eventId!: number;

  @Column
  status!: "confirmed" | "declined" | "pending";

  @BelongsTo(() => User)
  user!: User;

  @BelongsTo(() => Events)
  event!: Event;
}