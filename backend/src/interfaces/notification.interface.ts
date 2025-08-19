import { Notification } from "../models/notification.model"

export class NotificationCreateRequest{
    title!: string
    content!: string
    userId!: number
    createdAt!: Date

    constructor(title: string = '', content: string= '', userId: number= 0, createAt: Date= new Date()){
        this.title= title,
        this.content= content,
        this.userId= userId,
        this.createdAt= createAt
    }
    
}

export class NotificationCreateResponse{
    id!:number
    title!: string
    content!: string
    userId!: number
    createdAt!: Date
    isRead!: boolean

    constructor(data: any){
        this.id= data.id;
        this.title=data.title;
        this.content= data.content;
        this.userId= data.userId;
        this.createdAt= data.createdAt;
        this.isRead= data.isRead;
    }
}

export class NotificationResponses{
    isSuccess!: boolean
    message!: string
    notification!: Notification[]
    unread!: number
}