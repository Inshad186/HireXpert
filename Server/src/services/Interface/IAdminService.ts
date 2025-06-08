import { UserType } from "@/types/Type";

export interface IAdminService {
    login( email:string, password:string ) : Promise<{accessToken:string, refreshToken:string, admin:UserType }>
    getDashboardStats() : Promise<{totalUsers: number; totalFreelancers: number; totalClients: number;}>
    getUsersList(): Promise<any[]>
    blockUser(userId : string) : Promise<void>
}