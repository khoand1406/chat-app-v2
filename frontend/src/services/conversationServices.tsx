import { BaseUrl, CONVERSATIONS_PATH } from "../constants/ApiContants";
import type { IConversationResponse, IGroupConversationCreateRequest, IUserConversationCreateRequest } from "../models/interfaces/Conversation";
import ApiHelper from "../utils/ApiHelper";


    export const getConversations= async(): Promise<IConversationResponse[]> => {
        try {
            
            const apiHelper= new ApiHelper();
            const response= await apiHelper.get(CONVERSATIONS_PATH);
            if (!response || !Array.isArray(response)) {
                throw new Error("Invalid response format");
            }
            return response as IConversationResponse[];

        } catch (error) {
            console.log("Error fetching conversations:", error);
            throw error;
        }
    }

    export const createUserConversations= async (request: IUserConversationCreateRequest):Promise<IConversationResponse>=>{
        try {
            const apiHelper= new ApiHelper();
            const response= await apiHelper.postJson(`${BaseUrl}/users`, request);
            if(!response || response.data){
                throw new Error("Invalid response format");
            }
            return response as IConversationResponse;

        } catch (error) {
            console.log("Error creating conversations", error);
            throw error;
        }
    }

    export const createGroupConversations= async (request:IGroupConversationCreateRequest):Promise<IConversationResponse>=>{
        try {
            const apiHelper= new ApiHelper();
            const response= await apiHelper.postJson(`${BaseUrl}/groups`, request);
            if(!response || response.data){
                throw new Error("Invalid response format");
            }
            return response as IConversationResponse;
        } catch (error) {
            console.log("Error creating conversations", error);
            throw error;
        }
    }


