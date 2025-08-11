import { BaseUrl, CONVERSATIONS_PATH, CREATEGROUP, CREATEUSERCONV } from "../constants/ApiContants";
import type { IConversationResponse, IUserConversationCreateRequest } from "../models/interfaces/Conversation";
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
            if(!response){
                throw new Error("Invalid response format");
            }
            return response as IConversationResponse;

        } catch (error) {
            console.log("Error creating conversations", error);
            throw error;
        }
    }

   export const createGroupConversations = async (
  formData: FormData
): Promise<IConversationResponse> => {
  try {
    const apiHelper = new ApiHelper();
    // Gửi nguyên formData
    const response = await apiHelper.postFormData(CREATEGROUP, formData);

    if (!response) {
      throw new Error("Invalid response format");
    }

    return response.data as IConversationResponse;
  } catch (error) {
    console.log("Error creating conversations", error);
    throw error;
  }
};

    export const createUserConversation= async(request: IUserConversationCreateRequest): Promise<IConversationResponse>=>{
        try {
            const apiHelper= new ApiHelper();
            const response= await apiHelper.postJson(CREATEUSERCONV, request);
            if(!response){
                throw new Error("Invalid response format");
            }
            return response as IConversationResponse;
        } catch (error) {
            console.log("Error createing conversation", error);
            throw error;
        }
    }


