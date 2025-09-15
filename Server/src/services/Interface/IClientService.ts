import { ClientProfileType, FreelancerProfileType } from "@/types/Type";
import { GigType } from "@/types/Type";

export interface GigWithFreelancer {
    gig: GigType
    freelancer: FreelancerProfileType
}
export interface IClientService {
    updateProfile(userId: string, userData : Partial<ClientProfileType>) : Promise<ClientProfileType>
    getGigs(): Promise<GigType[]>
    getGigDetails(gigId: string) : Promise<GigWithFreelancer>
}