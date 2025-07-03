import { ClientProfileType } from "@/types/Type";

export interface IClientService {
    updateProfile(userId:string, userData : Partial<ClientProfileType>) : Promise<{userDetails : ClientProfileType}>
}