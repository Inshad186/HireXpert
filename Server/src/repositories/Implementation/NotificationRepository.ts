import { INotificationRepository } from "../Interface/INotificationRepository";
import { BaseRepository } from "../BaseRepository/implementation";
import { NotificationType } from "@/types/Type";
import Notification from "@/models/notificationModel";

export class NotificationRepository extends BaseRepository<NotificationType> implements INotificationRepository{
    constructor(){
        super(Notification)
    }
    async create(data: Partial<NotificationType>): Promise<NotificationType> {
        const notification = new Notification(data)
        await notification.save();
        return notification;
    }

    async findNotify(freelancerId: string): Promise<NotificationType[]> {
        return await Notification.find({freelancer: freelancerId}).sort({ createdAt: -1 })
    }
    
    async markOrderNotificationsRead(orderId: string, freelancerId: string): Promise<void> {
        await Notification.updateMany(
            { orderId, freelancer: freelancerId, isRead: { $ne: true }},
            { $set: { isRead: true } });
    }

    async deleteNotify(notificationId: string): Promise<void> {
        await Notification.findByIdAndDelete(notificationId)
    }
}