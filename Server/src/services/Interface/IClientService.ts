import { ClientProfileType, FreelancerProfileType } from "@/types/Type";
import { GigType, OrderType, GigFilters } from "@/types/Type";

export interface GigWithFreelancer {
    gig: GigType
    freelancer: FreelancerProfileType
    profileImage: string
    freelancerReviews: any[]
}
export interface IClientService {
    updateProfile(userId: string, userData : Partial<ClientProfileType>) : Promise<ClientProfileType>;
    getGigs(filers: GigFilters ): Promise<GigType[]>;
    getGigDetails(gigId: string) : Promise<GigWithFreelancer>;
    createPaymentIntent(userId: string, gigId: string, plan: string ): Promise<{clientSecret: string, paymentIntentId: string}>
    createOrder(userId:string, gigId:string, requirements:string, plan:string, paymentIntentId: string): Promise<OrderType>;
    getMyOrders(userId: string): Promise<OrderType[]>;
    acceptOrders(orderId: string, clientId: string, feedback: string, rating: number): Promise<OrderType | null>;
    releasePayment(orderId: string, by: "client" | "system", reason: string, extra?: Record<string, unknown>): Promise<OrderType | null>;
    requestRivision(orderId: string, clientId: string, revision: string): Promise<OrderType | null>;
}