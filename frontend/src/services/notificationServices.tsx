import { NOTIFICATION, READ_ALL, READ_NOTIFICATION } from "../constants/ApiContants";
import type { NotificationResponse } from "../models/interfaces/Notification";
import ApiHelper from "../utils/ApiHelper";


export const getNotification= async (): Promise<NotificationResponse[]> => {
    try {
        const apiHelper= new ApiHelper();
        const response= await apiHelper.get(NOTIFICATION);
        if(!Array.isArray(response)){
            throw new Error("Invalid response format");
        }
        return response as NotificationResponse[];
    } catch (error) {
        console.log(error);
        throw new Error("Error when fetch notification:" + error);
    }
}

export const readNotification= async(id: number): Promise<Response>=> {
    try {
        const apiHelper= new ApiHelper();
        const response= await apiHelper.post(READ_NOTIFICATION(id), {id: id})
        if(!response){
            throw new Error("Invalid response format");
        }
        return response as Response
    } catch (error) {
        console.log(error);
        throw new Error("Error when fetch notification:" + error);
    }
}

export const readAllNotification= async(): Promise<Response>=> {
    try{
        const apiHelper= new ApiHelper();
        const response= await  apiHelper.post(READ_ALL, {});
        if(!response){
            throw new Error("Invalid response format");
        }
        return response as Response
    }catch(error){
        console.log(error);
        throw new Error("Error when fetch notification:" + error);
    }
}

