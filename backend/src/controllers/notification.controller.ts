import { Conversation } from "../models/conversation.model";
import { Notification } from "../models/notification.model";
import { Token } from "../models/token";
import { User } from "../models/user.model";
import { UserConversation } from "../models/userconversation.model";
import { NotificationServices } from "../services/notification.services";
import { Request, Response } from "express";
export class NotificationController{
    private _NotificationService: NotificationServices;
    constructor(service?: NotificationServices){
        this._NotificationService= service ?? new NotificationServices();
    }
    getNotification= async(request:Request, response:Response)=> {
        try {
            const token= request.headers.authorization?.split(" ")[1];
            if(!token){
                return response.status(401).json({status: "failed", message: "Not Authenticated"});
            }
            const foundToken= await Token.findOne({where: {token: token}});
            if(!foundToken){
                return response.status(401).json({status: "failed", message: "Not Found Token"});
            }
            const userId= foundToken.userId;
            if(!token){
                return response.status(401).json({status: "failed", message: "Not found user with token. Login again"});
            }
            const result= await this._NotificationService.getUserNotifications(userId);
            return response.status(200).json(result);
        } catch (error) {
            console.log(error);
            return response.status(400).json(error);
        }
    }

    sendNotification= async(request: Request, response: Response)=> {
        try {
            const token= request.headers.authorization?.split(" ")[1];
            if(!token){
                return response.status(401).json({status: "failed", message: "Not Authenticated"});
            }
            const foundToken= await Token.findOne({where: {token: token}});
            if(!foundToken){
                return response.status(401).json({status: "failed", message: "Not Found Token"});
            }
            const userId= foundToken.userId;
            const user= await User.findByPk(userId)
            if(!user){
                return response.status(401).json({status: "failed", message: "Not found user with token. Login again"});
            }
            const payload= request.body;
            if(!payload || Object.keys(payload).length ===0){
                return response.status(400).json({status:"failed", message:"No payload received or invalid field"});
            }
            if(!payload.title || !payload.content ||!payload.userId){
                return response.status(400).json({status:"failed", message: "Invalid fields. Create notification failed"});
            }

            const conversationId= payload.conversationId;
            if(!conversationId){
                return response.status(400).json({status:"failed", message: "Invalid fields. Create notification failed"});
            }
            const conversation= await Conversation.findByPk(conversationId);
            if(!conversation){
                return response.status(400).json({status:"failed", message: "Invalid fields. Create notification failed"});
            }
            
            const members = await UserConversation.findAll({
                where: { conversationId: conversation.id},
                attributes: ["userId"],
            });
            const membersId= members.map((item)=> item.id).filter((uid)=> uid!==userId);

            const result= await this._NotificationService.sendUsersNotification(membersId, payload);
            return result;
        } catch (error) {
            console.log(error);
            return response.status(400).json(error);
        }
    }

    readNotification= async(request: Request, response: Response)=>{
        const io= request.app.get("io");
        try {
            
            const token= request.headers.authorization?.split(" ")[1];
            if(!token){
                return response.status(401).json({status: "failed", message: "Not Authenticated"});
            }
            const foundToken= await Token.findOne({where: {token: token}});
            if(!foundToken){
                return response.status(401).json({status: "failed", message: "Not Found Token"});
            }
            const userId= foundToken.userId;
            const user= User.findByPk(userId);

            if(!user){
                return response.status(401).json({status: "failed", message: "Not found user with token. Login again"});
            }
            const notificationId= request.params.id;
            if(isNaN(parseInt(notificationId))) return response.status(400).json({status: "failed", message: "Wrong format"})
            const notification= await Notification.findByPk(notificationId);
            if(!notification) return response.status(404).json({status: "failed", message: "Not found"});
            await this._NotificationService.readNotification(parseInt(notificationId));
            
            return response.status(200).json({status: "success", message: "update read status successfully"});

        } catch (error) {
            console.log(error);
            return response.status(400).json({status: "failed", message: error});
        }
    }

    markAsreadAll= async (request:Request, response: Response)=> {
        const io= request.app.get("io");
        try {
            const token= request.headers.authorization?.split(" ")[1];
            if(!token){
                return response.status(401).json({status: "failed", message: "Not Authenticated"});
            }
            const foundToken= await Token.findOne({where: {token: token}});
            if(!foundToken){
                return response.status(401).json({status: "failed", message: "Not Found Token"});
            }
            const userId= foundToken.userId;
            const user= User.findByPk(userId);

            if(!user){
                return response.status(401).json({status: "failed", message: "Not found user with token. Login again"});
            }
            await this._NotificationService.markAllAsRead(userId);
            io.to(`user_${userId}`).emit("notificationsReadAll", {
            userId,
            readAt: new Date(),
        });
            return response.status(200).json({status: "success", message: "update read status successfully"});
        } catch (error) {
            console.log(error);
            return  response.status(400).json({status: "failed", message: error});
        }
    }
}