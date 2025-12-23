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

    async deleteNotify(notificationId: string): Promise<void> {
        await Notification.findByIdAndDelete(notificationId)
    }
}