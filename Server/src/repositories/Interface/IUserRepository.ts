import { UserType } from "@/types/Type";

export interface IUserRepository {
  createUser(user: Partial<UserType>): Promise<UserType>;
  findByEmail(email: string): Promise<UserType | null>;
}
