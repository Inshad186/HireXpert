import Freelancer from "@/models/freelancerModel"
import Order from "@/models/orderModel"
import Gig from "@/models/gigModel"
import { Types } from "mongoose"
import { IFreelancerRepository } from "../Interface/IFreelancerRepository"
import { FreelancerProfileType, OrderStatus } from "@/types/Type"
import { BaseRepository } from "../BaseRepository/implementation"
import { PLATFORM_FEE_RATE } from "@/constants/payment.constant"

export class FreelancerRepository extends BaseRepository <FreelancerProfileType> implements IFreelancerRepository {
    constructor() {
        super(Freelancer)
    }
    async countFreelancerDashStats(freelancer: string): Promise<{ totalOrders: number; myGigs: number; activeOrders: number }> {
        try {
            const totalOrders = await Order.countDocuments({freelancer})
            const myGigs = await Gig.countDocuments({freelancer})
            const activeOrders = await Order.countDocuments({freelancer, status:"accepted"})
            return {totalOrders, myGigs, activeOrders}
        } catch (error) {
            throw new Error("Error to getting the counts");
        }
    }

    async getEarnings(freelancerId: string): Promise<{ totalEarned: number; inEscrow: number; completedOrders: number }> {
    const id = new Types.ObjectId(freelancerId);

    const [released, held] = await Promise.all([
        Order.aggregate([
        { $match: { freelancer: id, "escrowDetails.escrowStatus": "RELEASED", "paymentDetails.freelancerAmount": { $exists: true } } },
        { $group: { _id: null, total: { $sum: "$paymentDetails.freelancerAmount" }, count: { $sum: 1 } } },
        ]),
        Order.aggregate([
        {
            $match: {
            freelancer: id,
            "escrowDetails.escrowStatus": "HELD",
            status: { $in: [OrderStatus.ACCEPTED, OrderStatus.IN_PROGRESS, OrderStatus.DELIVERED, OrderStatus.REVISION] },
            },
        },
        { $group: { _id: null, total: { $sum: "$paymentDetails.amount" } } },
        ]),
    ]);

    const heldTotal = held[0]?.total ?? 0;
    return {
        totalEarned: released[0]?.total ?? 0,
        inEscrow: Math.round(heldTotal * (1 - PLATFORM_FEE_RATE) * 100) / 100, // the freelancer's share only
        completedOrders: released[0]?.count ?? 0,
    };
    }

    async getRecentEarnings(freelancerId: string, limit = 10) {
    return await Order.find({ freelancer: freelancerId, "escrowDetails.escrowStatus": "RELEASED", "paymentDetails.freelancerAmount": { $exists: true } })
        .sort({ "escrowDetails.releasedAt": -1 })
        .limit(limit)
        .select("gig plan paymentDetails.freelancerAmount escrowDetails.releasedAt")
        .populate("gig", "title");
    }
}