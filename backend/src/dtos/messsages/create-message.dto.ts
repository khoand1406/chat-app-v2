import { Message } from "../../models/message.model"

export class CreateMessageRequest{
    
    conversationId!: number
    senderId!: number
    sendAt!:Date
    content!: string

    constructor(data: any, senderId: number = 0) {
        this.conversationId= data.conversationId
        this.senderId= senderId
        this.sendAt= data.sendAt
        this.content= data.content
    }

    
}


export class CreateMessageResponse{
    id?: number
    conversationId!: number
    senderId!: number
    sendAt!:Date
    content!: string
    isRead!: boolean
    readAt?: Date

    constructor(message: Message, isRead: boolean= false){
        this.id= message.id;
        this.conversationId= message.conversationId;
        this.senderId= message.senderId;
        this.content= message.content;
        this.sendAt= message.sendAt;
        this.isRead= isRead;
        this.readAt= isRead ? new Date() : undefined;   
    }
}