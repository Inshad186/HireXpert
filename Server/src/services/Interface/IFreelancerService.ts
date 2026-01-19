import { FreelancerProfileType } from "@/types/Type"
import { GigType, FileType, OrderType } from "@/types/Type"

export interface IFreelancerService {
    updateProfile(userId:string, userData : Partial<FreelancerProfileType>) : Promise<{userDetails : FreelancerProfileType}>
    createGig(gig:GigType, serviceImages:FileType[] | undefined) : Promise<string>;
    getGigList(freelancerId: string): Promise<GigType[]>
    updateGigStatus(id:string, currentStatus:boolean) : Promise<void>
    getFreelancerDashStats(freelancer: string) : Promise<{totalOrders:number, myGigs:number, activeOrders:number}>
    getOrderList(freelancer: string): Promise<OrderType[]>
    getOrders(orderId: string): Promise<OrderType | null>
    acceptOrder(id: string): Promise<OrderType | null>
    rejectOrder(orderId: string, reason: string): Promise<void>
    inprogressOrder(orderId: string ): Promise<OrderType | null>
    deliveryOrder(orderId: string, freelancerId: string, deliveryFiles: FileType[], deliveryNotes: string): Promise<OrderType[]>
    startStripeOnboarding(freelancerId: string): Promise<{onboardingUrl: string, accountId: string}>
    getStripeStatus(freelancerId: string): Promise<{status: string, message: string}>
}