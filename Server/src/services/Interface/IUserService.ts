import { UserType } from "@/types/Type";

export interface IUserService {
  signup(user: UserType): Promise<string>;
  login(email:string, password:string) : Promise<{accessToken: string, refreshToken: string, user:UserType}>;
  verifyOtp(otp: string, email: string) : Promise<{accessToken:string, refreshToken:string, user: UserType}>;
  resendOtp(email: string) : Promise<void>;
}
