import { ClientProfileType, OrderType } from "@/types/Type";
import { IBaseRepository } from "../BaseRepository/interface";

export interface IClientRepository extends IBaseRepository <ClientProfileType> {
    findd(userId: string): Promise<OrderType[]>;
}