import { NotificationType } from "@/types/Type";
import { INotificationService } from "../Interface/INotificationService";
import { INotificationRepository } from "@/repositories/Interface/INotificationRepository";
import { IClientRepository } from "@/repositories/Interface/IClientRepository";
import { IFreelancerRepository } from "@/repositories/Interface/IFreelancerRepository";
import { IOrderRepository } from "@/repositories/Interface/IOrderRepository";

export class NotificationService implements INotificationService {
    constructor(
        private notificationRepository: INotificationRepository) {}

    async createNotification(data: Partial<NotificationType>): Promise<NotificationType> {
        try {
            return await this.notificationRepository.create(data)
        } catch (error) {
            console.error("Error creating notification:", error);
            throw error
        }
    }
    
    async getNotifications(freelancerId: string): Promise<NotificationType[]> {
        try {
            return await this.notificationRepository.findNotify(freelancerId)
        } catch (error) {
            console.error("Error fetching notifications:", error);
            throw error
        }
    }
}