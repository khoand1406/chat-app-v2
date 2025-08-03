import { ConversationServices } from "../services/conversation.services";
import { Request, Response } from 'express';
export class ConversationController{
    constructor(private readonly _service: ConversationServices){}

    getConversations= async (request: Request, response: Response)=> {
        try {
            const userid= request.body;
            if(userid==null){
                return response.status(401).json({"Error": "UserId not found"})
            }
            const result= await this._service.getUserConversations(userid)
            return response.status(200).json(result);
        } catch (error) {
            return response.status(401).json({"Error":`${error}`});
        }
    }

    
}