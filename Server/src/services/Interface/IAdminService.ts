import { UserType } from "@/types/Type";

export interface IAdminService {
    login( email:string, password:string ) : Promise<{accessToken:string, refreshToken:string, admin:UserType }>
    getTotalUsers() : Promise<{totalUsers : number}>
}