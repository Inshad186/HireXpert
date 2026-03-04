import { MessageType } from "@/types/Type";
import { IMessageService } from "../Interface/IMessageService";
import { IMessageRepository } from "@/repositories/Interface/IMessageRepository";

export class MessageService implements IMessageService {
    constructor(
        private messageRepository: IMessageRepository
    ){}

    async getOrderMessages(orderId: string): Promise<MessageType[]> {
        return await this.messageRepository.find({ orderId });
    }
}