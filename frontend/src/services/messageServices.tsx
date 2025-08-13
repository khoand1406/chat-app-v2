import { MESSAGE_READ, MESSAGE_SEND, MESSAGES_PATH } from "../constants/ApiContants";
import type { IMessageRequest, MessageResponse } from "../models/interfaces/Messages";
import ApiHelper from "../utils/ApiHelper";

export const getMessages= async (conversationId: number): Promise<MessageResponse[]>=> {
    try {
        const apiHelper= new ApiHelper();
        const response= await apiHelper.get(MESSAGES_PATH(conversationId));
        if(!response || !Array.isArray(response)){
            throw new Error("Invalid response format");
        }
       
        return response as MessageResponse[];
    } catch (error) {
        console.log("Error fetching message with conversation ID: "+ conversationId)
        throw error;
    }
}

export const sendMessages= async (message: IMessageRequest):Promise<MessageResponse>=>{
    try {
        const apiHelper= new ApiHelper();
        const response= await apiHelper.post(MESSAGE_SEND, message)
        if(!response){
            throw new Error("Invalid response format");
        }
        console.log(response);
        return response as MessageResponse;
    } catch (error) {
        console.log("Error when send messages ")
        throw error;
    }

}

export const setReadMessages= async(conversationId: number): Promise<void>=>{
    try {
        const apiHelper= new ApiHelper();
        const response= await apiHelper.post(MESSAGE_READ, {conversationId: conversationId});
        if(!response){
            throw new Error("Invalid response format");
        }
        if(response.status!=="success"){
            throw new Error(response.error)
        }
    } catch (error) {
        throw error;
    }
}