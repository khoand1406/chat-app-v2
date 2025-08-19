import { sequelize } from "../database/config";
import { NotificationCreateRequest, NotificationCreateResponse, NotificationResponses } from "../interfaces/notification.interface";
import { Notification } from "../models/notification.model";

export class NotificationServices{
    async createNotification(model: NotificationCreateRequest):Promise<NotificationCreateResponse>{
        const transaction= await sequelize.transaction();
        try {
            const notification= await Notification.create({title: model.title, 
                                                    content: model.content, 
                                                    userId: model.userId, 
                                                    isRead: false, 
                                                    createdAt: Date.now()}, {transaction});
            if(!notification){
                throw new Error("Notification creation failed");
            }
            if(!notification.id){
                throw new Error("Notification Id invalid");
            }
            await transaction.commit();
            return new NotificationCreateResponse(notification);
        } catch (error) {
            transaction.rollback();
            throw new Error(`Unexpected error during notification: ${error}`);
        }
    }

    async readNotification(notificationId: number): Promise<void>{
        const transaction=await sequelize.transaction();
        try {
            const notification=await Notification.findByPk(notificationId)
            if(!notification){
                throw new Error(`Not found notification with id: ${notification} `)
            }
            notification.isRead= true;
            await notification.save();
            await transaction.commit();

        } catch (error) {
            transaction.rollback()
            console.log("Error during read notification: ");
            throw new Error(`Error when update state of notification: ${notificationId}`);
        }
    }

    async sendUsersNotification(userids: number[], model: NotificationCreateRequest):Promise<NotificationResponses>{
        const transaction= await sequelize.transaction();
        try {
            const listNotificationCreate = userids.map((userId) => ({
                title: model.title,
                content: model.content,
                userId: userId,
                isRead: false,
                createdAt: new Date(),
        }));
            const result= await Notification.bulkCreate(listNotificationCreate, {transaction});

            await transaction.commit();
            return {
                isSuccess: true,
                message: `Successfully created ${result.length} number of records`,
                notification: result,
                unread: result.length
            }

        } catch (error) {
            transaction.rollback();
            console.log('Error in creating bulk of notifications');
            throw new Error("Error in creating buk of notifications: "+ error);
        }
    }

    async getUserNotifications(userId: number):Promise<NotificationResponses>{
        try{
            const result= await Notification.findAll({where: {userId: userId}, order: [['createdAt', 'DESC']]});
            const unreadCount = await Notification.count({
      where: { userId: userId, isRead: false }, // đếm chưa đọc
    });
            return {
                isSuccess: true,
                message: `Successfully get ${result.length} records of Notification`,
                notification: result,
                unread: unreadCount
            }
        }catch(error){
            throw new Error("Error in getting data: "+ error)
        }
    }

    async markAllAsRead(userId: number):Promise<void>{
        const transaction= await sequelize.transaction()
        try {
            await Notification.update({isRead: true}, {where: {userId: userId}, transaction});
            await transaction.commit();

        } catch (error) {
            transaction.rollback();
            console.log("Error when update read status of user: "+ error);
            throw error
        }
    }
}