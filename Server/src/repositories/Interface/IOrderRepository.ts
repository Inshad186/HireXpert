import { OrderType } from "@/types/Type";
import { IBaseRepository } from "../BaseRepository/interface";
import { OrderStatus, Actor } from "@/models/orderModel";

export interface IOrderRepository extends IBaseRepository<OrderType>{
    getOrders(orderId: string): Promise<OrderType | null>
    findByClient(client: string): Promise<OrderType[]>
    findByFreelancer(freelancer: string): Promise<OrderType[]>
    updateOrder(orderId: string, updatedData: any): Promise<any>
    updateStatus( orderId: string, from: OrderStatus | OrderStatus[], to: OrderStatus, changedBy: Actor, extra?: Record<string, unknown>, reason?: string ): Promise<any>;
    deleteOrder(orderId: string): Promise<void>
    findByPaymentIntentId(paymentIntentId: string): Promise<OrderType | null>
    getFreelancerReviews(freelancerId: string): Promise<any>
}