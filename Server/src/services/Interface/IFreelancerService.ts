import { FreelancerProfileType } from "@/types/Type"
import { GigType } from "@/types/Type"

export interface IFreelancerService {
    updateProfile(userId:string, userData : Partial<FreelancerProfileType>) : Promise<{userDetails : FreelancerProfileType}>
    createGig(gig:GigType) : Promise<string>;
}