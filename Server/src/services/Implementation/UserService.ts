import { IUserService } from "../Interface/IUserService"; 
import { IUserRepository } from "@/repositories/Interface/IUserRepository";
import bcrypt from "bcrypt"
import { UserType } from "@/types/Type";
import { HttpResponse } from "@/constants/response.constant";
import { generateAccessToken, generateRefreshToken, } from "@/utils/jwt.util";
import { generateHttpError } from "@/utils/http-error.util";
import { HttpStatus } from "@/constants/status.constant";
import { ObjectId } from "mongoose";
import generateOtp from "@/utils/generate-otp.util";
import { env } from "@/config/env.config";
import { transporter } from "@/config/nodemailer.config";
import { redisClient } from "@/config/redis.config";

export class UserService implements IUserService {
  constructor(private userRepository: IUserRepository) {}

  async signup(user: UserType): Promise<string> {
    const existingUser = await this.userRepository.findByEmail(user.email);
  
    if (existingUser) throw new Error(HttpResponse.USER_EXIST);
  
    const hashedPassword = await bcrypt.hash(user.password!, 10);
  
    const otp = generateOtp();
    console.log("Generated OTP: ", otp);
  
    const mailOptions = {
      from: env.SENDER_EMAIL,
      to: user.email,
      subject: "6-digit OTP",
      text: `Your OTP code is ${otp}`,
    };
  
    console.log("Sender Email: ", env.SENDER_EMAIL);
    console.log("Sender Password: ", env.SENDER_PASSWORD);
    console.log("Mail Options: ", mailOptions);
  
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log("Email sent successfully: ", info.response);
    } catch (err) {
      console.error("Failed to send email:", err);
    }
    const tempData = JSON.stringify({
      otp: otp,
      userData: {
        ...user,
        password: hashedPassword 
      }
    });
    console.log("TEMPDATA : ",tempData)

    await redisClient.setEx(user.email!, 300, tempData);

    return user.email!;
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

    if(!isMatchPassword){
      throw generateHttpError(HttpStatus.BAD_REQUEST, HttpResponse.PASSWORD_INCORRECT)
    }

    let accessToken = await generateAccessToken(user._id as ObjectId)
    let refreshToken = await generateRefreshToken(user._id as ObjectId)

    console.log("ACCESS TOKEN >>>>>>>>  : ",accessToken)

    return { accessToken, refreshToken, user}
  }


  async verifyOtp(otp:string, email:string): Promise<{accessToken:string, refreshToken:string, user: UserType}> {

    const storedDataString = await redisClient.get(email)

    if(!storedDataString) {
      throw generateHttpError(HttpStatus.BAD_REQUEST, HttpResponse.OTP_NOT_FOUND)
    }
    const storedData = JSON.parse(storedDataString)
    console.log("STORED DATA >>>> : ",storedData)

    if(storedData.otp !== otp) {
      throw generateHttpError(HttpStatus.BAD_REQUEST, HttpResponse.OTP_INCORRECT)
    }
      const user  = {
        name : storedData.userData.name ,
        email : storedData.userData.email,
        password : storedData.userData.password 
      }
      console.log("user >>>>> : ",user)

      const createdUser = await this.userRepository.createUser(user)
      if (!createdUser) {
        throw generateHttpError(HttpStatus.NOT_FOUND, HttpResponse.USER_CREATION_FAILED);
      }

      const accessToken = await generateAccessToken(createdUser._id as ObjectId);
      const refreshToken = await generateRefreshToken(createdUser._id as ObjectId);

      return { accessToken, refreshToken, user: createdUser };
  }

  async resendOtp(email: string): Promise<void> {
    const storedDataString = await redisClient.get(email);
  
    if (!storedDataString) {
      throw generateHttpError(HttpStatus.BAD_REQUEST, HttpResponse.OTP_NOT_FOUND);
    }
  
    const storedData = JSON.parse(storedDataString);
  
    const newOtp = generateOtp();
  
    // Resend mail logic
    const mailOptions = {
      from: env.SENDER_EMAIL,
      to: email,
      subject: "6-digit OTP - Resend",
      text: `Your new OTP code is ${newOtp}`,
    };
  
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log("Resent Email successfully: ", info.response);
    } catch (err) {
      console.error("Failed to resend OTP email:", err);
      throw generateHttpError(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to send OTP email");
    }
  
    // Update Redis with new OTP
    const updatedTempData = JSON.stringify({
      ...storedData,
      otp: newOtp,
    });
    await redisClient.setEx(email, 300, updatedTempData); 
  }

  async assignRole(role: string, email: string): Promise<{userRole: string;}> {
    const user = await this.userRepository.findByEmail(email)
    if(!user){
      throw generateHttpError(HttpStatus.NOT_FOUND, HttpResponse.USER_NOT_FOUND)
    }
    await this.userRepository.updateUserRole(user.email,role)

    return {userRole : role}
  }
  
}
