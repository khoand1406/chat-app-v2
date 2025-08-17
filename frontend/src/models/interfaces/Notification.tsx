export interface NotificationResponse{
    isSuccess:boolean
    message: string
    notification: Notification[]
}

export interface Response{
    status: string
    message: string
}

export interface Notification{
    id:number,
    title: string
    content: string
    userId: number,
    createdAt:Date
    isRead: boolean


}