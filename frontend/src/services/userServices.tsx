import { USER_CONVERSATIONS, USERLIST } from "../constants/ApiContants";
import type { UserResponse } from "../models/interfaces/Users";
import ApiHelper from "../utils/ApiHelper";

export const getUsersById= async (userid: number): Promise<UserResponse[]>=> {
    try {
        const apiHelper= new ApiHelper();
        const response= await apiHelper.get(USER_CONVERSATIONS(userid));
        if(!response || !Array.isArray(response)){
            throw new Error("invalid response format");
        }
        return response as UserResponse[];
    } catch (error) {
        console.log("Error fetching message with conversation ID: "+ userid)
        throw error;
        
    }
}

export const getUsers= async(): Promise<UserResponse[]>=>{
    try{
        const apiHelper= new ApiHelper();
        const response= await apiHelper.get(USERLIST);
        if(!response || !Array.isArray(response)){
            throw new Error("invalid response format");
        }
        return response as UserResponse[]
    }catch(error){
        console.log("Error fetching user list: ")
        throw error;
    }
}