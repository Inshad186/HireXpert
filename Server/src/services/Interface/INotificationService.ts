import { NotificationType } from "@/types/Type"

export interface INotificationService {
    createNotification(data: Partial<NotificationType>): Promise<NotificationType>
    getNotifications(freelancerId: string): Promise<NotificationType[]>
    markAsRead(notificationId: string): Promise<NotificationType | null>
    deleteNotify(notificationId: string): Promise<void>
}