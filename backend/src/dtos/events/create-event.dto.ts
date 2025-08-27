import { Attendance } from "../../models/attendence.model"

export class CreateEventRequest{
    
    content!: string
    description!: string
    participantIds!: number[]
    startDate!: Date
    endDate!:Date
}

export class CreateEventResponse{
    id!: number
    content!: string
    description!: string
    startDate!: Date
    endDate!: Date
    invitedParticipants: Attendance[]
    creatorId!: number

    constructor(data: any, invited: Attendance[]= []){
        this.id= data.id
        this.content= data.content,
        this.description= data.description,
        this.startDate= data.startDate,
        this.endDate= data.endDate,
        this.invitedParticipants= invited
        this.creatorId= data.creatorId;
    }
}

export class EventResponse{
    id!: number
    content!: string
    description!: string
    startDate!: Date
    endDate!: Date
    creatorId!: number
    constructor(data: any){
        this.id= data.id,
        this.content= data.content,
        this.description= data.description,
        this.startDate= data.startDate,
        this.endDate= data.endDate
        this.creatorId= data.creatorId
    }
}

export class EventDetailResponse{
    id!: number
    content!: string
    description!: string
    startDate!:Date
    endDate!: Date
    unConfirmed!: IUser[]
    creatorId!:number
    constructor(event: EventResponse, unConfirm: IUser[] = [] ){
        this.id= event.id,
        this.content= event.content
        this.description= event.description
        this.startDate= event.startDate
        this.endDate= event.endDate
        this.unConfirmed= unConfirm
        this.creatorId= event.creatorId
    }
}

export interface IUser{
    id: number
    username: string
    email: string
}