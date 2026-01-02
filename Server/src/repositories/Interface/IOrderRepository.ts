import { OrderType } from "@/types/Type";
import { IBaseRepository } from "../BaseRepository/interface";

export interface IOrderRepository extends IBaseRepository<OrderType>{
    getOrders(orderId: string): Promise<OrderType | null>
    findByClient(client: string): Promise<OrderType[]>
    findByFreelancer(freelancer: string): Promise<OrderType[]>
    updateOrder(orderId: string, updatedData: any): Promise<any>
    deleteOrder(orderId: string): Promise<void>
}