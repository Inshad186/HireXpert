import { OrderType } from "@/types/Type";
import { BaseRepository } from "../BaseRepository/implementation";
import Order from "@/models/orderModel";
import { IOrderRepository } from "../Interface/IOrderRepository";

export class OrderRepository extends BaseRepository<OrderType> implements IOrderRepository{
    constructor(){
        super(Order)
    }
    async getOrders(orderId: string): Promise<OrderType | null> {
        const order =  await Order.findById(orderId)
        .populate("client", "name")
        .populate("freelancer", "name")
        .populate("gig", "title pricing.basic.price")
        return order
    }

    async findByClient(client: string): Promise<OrderType[]> {
        const order =  await Order.find({client})
        .populate("client", "name")
        .populate("freelancer", "name")
        .populate("gig", "title pricing.basic.price")
        .sort({ createdAt: -1})
        return order
    }

    async findByFreelancer(freelancer: string): Promise<OrderType[]> {
        const order =  await Order.find({freelancer})
        .populate("client", "name")
        .populate("freelancer", "name")
        .populate("gig", "title pricing.basic.price")
        .sort({ createdAt: -1})
        return order
    }

    async deleteOrder(orderId: string): Promise<void> {
        await Order.findByIdAndDelete(orderId)
    }
}