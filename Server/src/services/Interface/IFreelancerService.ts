import { FreelancerProfileType } from "@/types/Type"

export interface IFreelancerService {
    updateProfile(userId:string, userData : Partial<FreelancerProfileType>) : Promise<{userDetails : FreelancerProfileType}>
}