import { UserType, FileType } from "@/types/Type";

export interface IUserService {
  signup(user: UserType): Promise<string>;
  login(email:string, password:string) : Promise<{accessToken: string, refreshToken: string, user:UserType}>;
  verifyOtp(otp: string, email: string, apiType: string) : Promise<{accessToken?:string, refreshToken?:string, user: UserType}>;
  assignRole(role:string, email:string) : Promise<{userRole:string}>
  updateProfile(id: string, profileImage: FileType | undefined): Promise<{user: UserType}>;
  updateUserName(userId: string, name: string) : Promise<{newName:string}>;
  getFreelancer() : Promise<{name:string, email:string}[]>;
  refreshToken(token:string) : Promise<string>;
  getProfileImage(userId:string) : Promise<{user:UserType}>
  resendOtp(email: string) : Promise<void>;
  resetPassword(email: string, password: string) : Promise<{user:UserType}>
  updateUserDetails(userId:string, userData:Partial<UserType>) : Promise<{userDetails:UserType}>
  forgetPassword(email:string) : Promise<{user:UserType}>
}
