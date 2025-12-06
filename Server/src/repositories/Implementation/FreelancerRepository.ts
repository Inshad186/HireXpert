import Freelancer from "@/models/freelancerModel"
import Order from "@/models/orderModel"
import Gig from "@/models/gigModel"
import { IFreelancerRepository } from "../Interface/IFreelancerRepository"
import { FreelancerProfileType } from "@/types/Type"
import { BaseRepository } from "../BaseRepository/implementation"

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
}