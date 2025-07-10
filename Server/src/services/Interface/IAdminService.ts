import { UserType } from "@/types/Type";
import { CategoryType } from "@/types/Type";
import { SkillType } from "@/types/Type";

export interface IAdminService {
    login( email:string, password:string ) : Promise<{accessToken:string, refreshToken:string, admin:UserType }>
    getDashboardStats() : Promise<{totalUsers: number; totalFreelancers: number; totalClients: number;}>
    getUsersList(): Promise<any[]>
    blockUser(userId : string) : Promise<void>
    addCategories(name : string) : Promise<CategoryType>
    getCategories() : Promise<void>
    addSkills(name: string, category: string): Promise<SkillType>
    getSkills():Promise<{ [category: string]: { _id: string; name: string }[] }>
    editSkills(skillId: string, skillName: string):Promise<any>
    deleteCategoryAndSkill(categoryId:string):Promise<void>
}