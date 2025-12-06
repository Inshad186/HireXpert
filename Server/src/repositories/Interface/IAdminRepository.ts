import { UserType } from "@/types/Type";
import { CategoryType } from "@/types/Type";
import { SkillType } from "@/types/Type";

export interface IAdminRepository {
    findByEmail(email: string) : Promise<UserType | null>;
    findById(userId: string): Promise<UserType | null>;
    countTotalDashboardStats(): Promise<{totalUsers:number, totalFreelancers: number; totalClients: number; totalGigs: number;}>
    getAllUsers(page: number, limit: number, role: string, search: string, status: string): Promise<{ users: any[]; totalUsers: number }>
    getAllOrders(): Promise<any[]>
    save(user:UserType): Promise<boolean>;
    createCategory(name: string): Promise<CategoryType>
    getAllCategories() : Promise<CategoryType[]>
    createSkill(name: string, category: string) : Promise<SkillType>
    getAllSkills(): Promise<{ [category: string]: { _id: string; name: string }[] }>
    updateAllSkills(skillId: string, skillName: string):Promise<void>
    deleteCategoryAndSkills(categoryId : string): Promise<void>
}