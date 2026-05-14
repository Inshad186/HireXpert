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

    async updateOrder(orderId: string, updatedData: any): Promise<any> {
        await Order.findByIdAndUpdate(orderId, updatedData, { new: true})
        .populate("client", "name")
        .populate("freelancer", "name")
        .populate("gig", "title pricing.basic.price")
    }

    async deleteOrder(orderId: string): Promise<void> {
        await Order.findByIdAndDelete(orderId)
    }

    async findByPaymentIntentId(paymentIntentId: string): Promise<OrderType | null> {
        return await Order.findOne({
            paymentDetails: {stripePaymentIntentId: paymentIntentId}
        })
    }

    async getFreelancerReviews(freelancerId: string): Promise<any> {
        return await Order.find({
            freelancer: freelancerId,
            "clientFeedback.rating": { $exists: true}
        })
        .populate("client", "name profilePicture")
        .select("client clientFeedback createdAt")
        .sort({createdAt: -1})
    }

}