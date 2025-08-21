import { Optional } from "sequelize";
export interface AttendanceAttributes{
    id: number,
    eventId: number,
    userId: number,
    status: string
}

export type AttendanceCreateAttribute= Optional<AttendanceAttributes, "id">