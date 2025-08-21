import { Request } from "express";
import { EventServices } from "../services/event.services";

export class EventController{
    private readonly _EventServices: EventServices;
    constructor(private readonly eventServices?: EventServices){
        this._EventServices= eventServices?? new EventServices();
    }
    getEvents= async(request: Request, response: Response) => {
        try {
            
        } catch (error) {
            
        }
    }

    getEventsByDate= async(request: Request, response: Response) => {
        try {
            
        } catch (error) {
            
        }
    }

    getEventDetails= async(request: Request, response: Response) => {
        try {
            
        } catch (error) {
            
        }
    }

    createEvent= async(request: Request, response: Response) => {
        try {
            
        } catch (error) {
            
        }
    }

    updateEvent= async(request: Request, response: Response)=> {
        try {
            
        } catch (error) {
            
        }
    }

    deleteEvent= async(request:Request, response: Response) => {
        try {
            
        } catch (error) {
            
        }
    }
}