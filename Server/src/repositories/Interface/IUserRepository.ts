import { UserType } from "@/models/userModel";

export interface IUserRepository {
  createUser(user: Partial<UserType>): Promise<UserType>;
  findByEmail(email: string): Promise<UserType | null>;
}
