import type { IUser } from "./Auth"

export interface EventResponse{
    id: number
    content: string
    description: string
    startDate: Date
    endDate: Date
    creatorId: number
}

export interface EventDetailResposne{
    id: number
    content: string
    description: string
    startDate:Date
    endDate: Date
    unConfirmed: IUser[]
}

export interface EventRes{
    success: boolean
}