import { IUserService } from "../Interface/IUserService"; 
import { IUserRepository } from "@/repositories/Interface/IUserRepository";
import bcrypt from "bcrypt"
import { UserType } from "@/models/userModel";
import { HttpResponse } from "@/constants/response.constant";
import { generateAccessToken, generateRefreshToken, } from "@/utils/jwt.util";
import { generateHttpError } from "@/utils/http-error.util";
import { HttpStatus } from "@/constants/status.constant";
import { ObjectId } from "mongoose";
import generateOtp from "@/utils/generate-otp.util";
import { env } from "@/config/env.config";
import { transport } from "@/config/nodemailer.config";


export class UserService implements IUserService {
  constructor(private userRepository: IUserRepository) {}

  async signup(userData: Partial<UserType>): Promise<UserType> {
    const existingUser = await this.userRepository.findByEmail(userData.email!);

    if (existingUser) throw new Error(HttpResponse.USER_EXIST)

    const hashedPassword = await bcrypt.hash(userData.password!, 10);
    const newUser = await this.userRepository.createUser({
      ...userData,
      password: hashedPassword,
    });

    const otp = generateOtp()
    console.log("OTP  OTP  OTP  >>>>>>>>>>>>>>>>    >>>>>>>>>>>>  : ",otp)
    return newUser;
  }

  async login(email: string, password: string): Promise<{ accessToken: string; refreshToken: string; user: UserType; }> {
    const user = await this.userRepository.findByEmail(email)

    if(!user){
      throw generateHttpError(HttpStatus.NOT_FOUND, HttpResponse.USER_NOT_FOUND)
    }

    if(!user.password){
      throw generateHttpError(HttpStatus.BAD_REQUEST, HttpResponse.INVALID_PASSWORD)
    }

    const isMatchPassword = await bcrypt.compare(password, user.password as string)

    console.log("CHECK PASSWORD  >>>>>>>> >>>>>>>>>     >>>>>>>>>>> : ",isMatchPassword)
    if(!isMatchPassword){
      throw generateHttpError(HttpStatus.BAD_REQUEST, HttpResponse.PASSWORD_INCORRECT)
    }

    let accessToken = await generateAccessToken(user._id as ObjectId)
    let refreshToken = await generateRefreshToken(user._id as ObjectId)

    console.log("ACCESS TOKEN >>>>>>>>    >>>>>>>>>     >>>>>>>>>>> : ",accessToken)

    return { accessToken, refreshToken, user}
  }

  async otpVerify(otp:string, email:string):Promise<{accessToken:string, refreshToken:string }>{
    const accessToken = ""
    const refreshToken = ""
    const user = ""
    return {accessToken, refreshToken}
  }
}
