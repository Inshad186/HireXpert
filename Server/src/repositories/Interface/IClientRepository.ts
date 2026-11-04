import { ClientProfileType, OrderType } from "@/types/Type";
import { IBaseRepository } from "../BaseRepository/interface";

export interface IClientRepository extends IBaseRepository <ClientProfileType> {
    getClientStats(clientId: string) : Promise<any>
}