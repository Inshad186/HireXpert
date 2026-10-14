import { MessageType } from "@/types/Type";

export interface IMessageService {
    getOrderMessages(orderId: string): Promise<MessageType[]>
}