import { FreelancerProfileType } from "@/types/Type"
import { GigType, FileType } from "@/types/Type"

export interface IFreelancerService {
    updateProfile(userId:string, userData : Partial<FreelancerProfileType>) : Promise<{userDetails : FreelancerProfileType}>
    createGig(gig:GigType, serviceImages:FileType[] | undefined) : Promise<string>;
    getGigList(freelancerId: string): Promise<GigType[]>
    updateGigStatus(id:string, currentStatus:boolean) : Promise<void>
}