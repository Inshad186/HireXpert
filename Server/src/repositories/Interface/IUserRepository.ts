import { UserType } from "@/types/Type";
import { IBaseRepository } from "../BaseRepository/interface";

export interface IUserRepository extends IBaseRepository <UserType> {
  findByEmail(email: string): Promise<UserType | null>;
  updateUserRole(email:string , role:string) : Promise<void>;
  findFreelancer() : Promise<Partial<UserType>[]>;
}
