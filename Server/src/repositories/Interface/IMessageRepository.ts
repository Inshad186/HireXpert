import { MessageType } from "@/types/Type";
import { IBaseRepository } from "../BaseRepository/interface";

export interface IMessageRepository extends IBaseRepository<MessageType> {
    // markMessageAsRead() : Promise<MessageType[]>
}