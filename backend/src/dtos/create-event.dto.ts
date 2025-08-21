export class CreateEventRequest{
    content!: string
    description!: string
    participantIds!: number[]
    startDate!: Date
    endDate!:Date
}

export class CreateEventResponse{
    content!: string
    description!: string
    startDate!: Date
    endDate!: Date
    constructor(data: any){
        this.content= data.content,
        this.description= data.content,
        this.startDate= data.startDate,
        this.endDate= data.endDate
    }
}

export class EventResponse{
    id!: number
    content!: string
    description!: string
    startDate!: Date
    endDate!: Date
    constructor(data: any){
        this.content= data.content,
        this.description= data.content,
        this.startDate= data.startDate,
        this.endDate= data.endDate
    }
}

export class EventDetailResponse{
    id!: number
    content!: string
    description!: string
    startDate!:Date
    endDate!: Date
    unConfirmed!: IUser[]
    constructor(event: EventResponse, unConfirm: IUser[] = [] ){
        this.id= event.id,
        this.content= event.content
        this.description= event.description
        this.startDate= event.startDate
        this.endDate= event.endDate
        this.unConfirmed= unConfirm
    }
}

export interface IUser{
    id: number
    username: string
    email: string
}