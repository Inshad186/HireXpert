import { FreelancerProfileType} from "@/types/Type";
import { IBaseRepository } from "../BaseRepository/interface";


export interface IFreelancerRepository extends IBaseRepository <FreelancerProfileType> {
    countFreelancerDashStats(freelancer: string) : Promise<{totalOrders: number; myGigs: number; activeOrders: number }>
}