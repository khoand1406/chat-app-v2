export interface UpdateEventRequest{
    title: string,
    content: string,
    description: string,
    startDate: Date,
    endDate: Date,
    participantIds:number[],
}