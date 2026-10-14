import Message from "@/models/messageModel";
import { MessageType } from "@/types/Type";
import { IMessageRepository } from "../Interface/IMessageRepository";
import { BaseRepository } from "../BaseRepository/implementation";

export class MessageRepository extends BaseRepository<MessageType> implements IMessageRepository {
    constructor(){
        super(Message)
    }
}
