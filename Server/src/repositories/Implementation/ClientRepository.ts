import Client from "@/models/clientModel"
import Order from "@/models/orderModel"
import { IClientRepository } from "../Interface/IClientRepository"
import { ClientProfileType, OrderType, OrderStatus } from "@/types/Type"
import { BaseRepository } from "../BaseRepository/implementation"
import { Types } from "mongoose";


export class ClientRepository extends BaseRepository <ClientProfileType> implements IClientRepository {
    constructor() {
        super(Client)
    }

    async getClientStats(clientId: string) {
    const id = new Types.ObjectId(clientId);
    const ACTIVE = [OrderStatus.ACCEPTED, OrderStatus.IN_PROGRESS, OrderStatus.DELIVERED, OrderStatus.REVISION];

    const [byStatus, spent, inEscrow, reviews, paidOrders] = await Promise.all([
        Order.aggregate([
        { $match: { client: id, status: { $nin: [OrderStatus.PAYMENT_PENDING, OrderStatus.PAYMENT_FAILED] } } },
        { $group: { _id: "$status", count: { $sum: 1 } } },
        ]),
        Order.aggregate([
        { $match: { client: id, "escrowDetails.escrowStatus": "RELEASED" } },
        { $group: { _id: null, total: { $sum: "$paymentDetails.amount" } } },
        ]),
        Order.aggregate([
        { $match: { client: id, "escrowDetails.escrowStatus": "HELD" } },
        { $group: { _id: null, total: { $sum: "$paymentDetails.amount" } } },
        ]),
        Order.aggregate([
        { $match: { client: id, "clientFeedback.rating": { $exists: true } } },
        { $group: { _id: null, count: { $sum: 1 }, average: { $avg: "$clientFeedback.rating" } } },
        ]),
        Order.countDocuments({ client: id, "paymentDetails.status": "SUCCEEDED" }),
    ]);

    const counts = Object.fromEntries(byStatus.map((s) => [s._id, s.count])) as Record<string, number>;
    const sum = (keys: string[]) => keys.reduce((total, k) => total + (counts[k] ?? 0), 0);

    return {
            totalOrders: sum(Object.keys(counts)),
            activeProjects: sum(ACTIVE),
            pendingRequests: counts[OrderStatus.PENDING] ?? 0,
            completedProjects: counts[OrderStatus.COMPLETED] ?? 0,
            totalSpent: spent[0]?.total ?? 0,
            inEscrow: inEscrow[0]?.total ?? 0,
            reviewsGiven: reviews[0]?.count ?? 0,
            averageRatingGiven: reviews[0] ? Math.round(reviews[0].average * 10) / 10 : null,
            paymentVerified: paidOrders > 0,
        };
    }
}