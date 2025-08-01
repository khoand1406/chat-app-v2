import { Message } from "../../models/message.model"

export class CreateMessageRequest{
    
    conversationId!: number
    senderId!: number
    sendAt!:Date
    content!: string
}


export class CreateMessageResponse{
    id?: number
    conversationId!: number
    senderId!: number
    sendAt!:Date
    content!: string 

    constructor(message: Message){
        this.id= message.id;
        this.conversationId= message.conversationId;
        this.senderId= message.senderId;
        this.content= message.content;
        this.sendAt= message.sendAt;

    }
}