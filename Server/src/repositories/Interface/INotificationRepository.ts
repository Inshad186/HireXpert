import { NotificationType } from "@/types/Type";
import { IBaseRepository } from "../BaseRepository/interface";

export interface INotificationRepository extends IBaseRepository<NotificationType>{
    create(data: Partial<NotificationType>): Promise<NotificationType>;
    findNotify(freelancerId: string): Promise<NotificationType[]>
}