import { UserType } from "@/models/userModel";

export interface IUserService {
  signup(user: Partial<UserType>): Promise<UserType>;
}
