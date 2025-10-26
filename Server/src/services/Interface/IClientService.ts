import { ClientProfileType, FreelancerProfileType } from "@/types/Type";
import { GigType, OrderType } from "@/types/Type";

export interface GigWithFreelancer {
    gig: GigType
    freelancer: FreelancerProfileType
    profileImage: string
}
export interface IClientService {
    updateProfile(userId: string, userData : Partial<ClientProfileType>) : Promise<ClientProfileType>
    getGigs(): Promise<GigType[]>
    getGigDetails(gigId: string) : Promise<GigWithFreelancer>
    createOrder(userId:string, freelancerId:string, gigId:string, requirements:string, plan:string): Promise<OrderType>
}