import { FreelancerProfileType } from "@/types/Type"
import { ServiceType, FileType } from "@/types/Type"

export interface IFreelancerService {
    updateProfile(userId:string, userData : Partial<FreelancerProfileType>) : Promise<{userDetails : FreelancerProfileType}>
    createGig(gig:ServiceType, serviceImages:FileType[] | undefined) : Promise<string>;
    getGigList(freelancerId: string): Promise<ServiceType[]>
    updateGigStatus(id:string, currentStatus:boolean) : Promise<void>
}