import { CreateMessageRequest, CreateMessageResponse } from "../dtos/messsages/create-message.dto";
import { Message } from "../models/message.model";

export class MessageService{
    async sendMessage(model: CreateMessageRequest): Promise<CreateMessageResponse>{
        try {
            const message= await Message.create({content: model.content
                                                , conversationId: model.conversationId
                                                , senderId: model.senderId, sendAt: model.sendAt})
            return new CreateMessageResponse(message);
        } catch (error) {
            throw Error(`Database update error: ${error}`)
        }
    }

    async getMessageByConversation(conversationId: number): Promise<CreateMessageResponse[]>{
        const message= await Message.findAll({where: {id: conversationId}, order: [['createAt','ASC']]});
        return message.map(index=> new CreateMessageResponse(index));
    }
}