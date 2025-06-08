import { UserType } from "@/types/Type";

export interface IAdminRepository {
    findByEmail(email: string) : Promise<UserType | null>;
    findById(userId: string): Promise<UserType | null>;
    countTotalDashboardStats(): Promise<{totalUsers:number, totalFreelancers: number; totalClients: number;}>
    getAllUsers():Promise<any[]>
    save(user:UserType): Promise<boolean>;
}