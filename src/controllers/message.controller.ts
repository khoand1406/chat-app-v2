import { Request, Response } from 'express';
import { CreateMessageRequest } from "../dtos/messsages/create-message.dto";
import { MessageService } from "../services/message.services";
export class MessageController{

    private  _messageService: MessageService;
    constructor(private readonly messageService?: MessageService){
        this._messageService = messageService ?? new MessageService();
    }

    sendMessage= async (request:Request, response:Response)=> {
        try {
            const data = request.body;
            data.sendAt = new Date();
            const messageDto = new CreateMessageRequest(data);
            const result= await this._messageService.sendMessage(messageDto)
            return response.status(201).json(result)
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            return response.status(400).json({status: 'failed', error: errorMessage});       
        }
    }

    getMessages= async (request: Request, response: Response)=> {
        try {
            const conversationId= request.body;
            const result= await this._messageService.getMessageByConversation(conversationId)
            return response.status(200).json(result)
        } catch (error) {
            return response.status(401).json({status: 'failed', error: error})
        }
    }
}