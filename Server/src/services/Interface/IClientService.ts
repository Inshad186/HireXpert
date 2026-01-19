import { ClientProfileType, FreelancerProfileType } from "@/types/Type";
import { GigType, OrderType } from "@/types/Type";

export interface GigWithFreelancer {
    gig: GigType
    freelancer: FreelancerProfileType
    profileImage: string
}
export interface IClientService {
    updateProfile(userId: string, userData : Partial<ClientProfileType>) : Promise<ClientProfileType>;
    getGigs(): Promise<GigType[]>;
    getGigDetails(gigId: string) : Promise<GigWithFreelancer>;
    createPaymentIntent(userId: string, freelancerId: string, gigId: string, price: number ): Promise<{clientSecret: string, paymentIntentId: string}>
    createOrder(userId:string, freelancerId:string, gigId:string, requirements:string, plan:string, paymentIntentId: string, price: number): Promise<OrderType>;
    getMyOrders(userId: string): Promise<OrderType[]>;
    acceptOrders(orderId: string, feedback: string, rating: number): Promise<OrderType | null>;
    requestRivision(orderId: string, revision: string, revisionCount: number): Promise<OrderType | null>;
}