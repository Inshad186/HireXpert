import { UserType } from "@/models/userModel";

export interface IUserService {
  signup(user: Partial<UserType>): Promise<UserType>;
  login(email:string, password:string) : Promise<{accessToken: string, refreshToken: string, user:UserType}>;
}
