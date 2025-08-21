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