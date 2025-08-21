export class CreateAttendenceRequest{
    eventId!: number
    userId!: number
    status!: string
    constructor(data: any){
        this.eventId= data.eventId,
        this.userId= data.userId,
        this.status= data.status
    }
}