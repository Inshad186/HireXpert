import { UserType } from "@/types/Type";

export interface IAdminRepository {
    findByEmail(email: string) : Promise<UserType | null>;
    countTotalUsers(): Promise<number>
}