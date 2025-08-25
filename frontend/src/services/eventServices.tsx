import { EVENTS, EVENTS_DETAILS } from "../constants/ApiContants";
import type { EventResponse } from "../models/interfaces/services";
import ApiHelper from "../utils/ApiHelper"

export const getEvents= async(startDate: Date, endDate: Date): Promise<EventResponse[]> => {
    try {
        const apiHelper= new ApiHelper();
        const result= apiHelper.getJson(EVENTS, {startDate, endDate});
        return result;
    } catch (error) {
        if(error instanceof Error){
            throw new Error(error.message)
        }
        throw error;
    }
}
export const getEventDetail= async(eventId: number): Promise<EventResponse[]>=>{
    try {
        const apiHelper= new ApiHelper();
        const result= apiHelper.get(EVENTS_DETAILS(eventId));
        return result;
    } catch (error) {
        if(error instanceof Error){
            throw new Error(error.message)
        }
        throw error;
    }
}