import { IUserService } from "../Interface/IUserService"; 
import { IUserRepository } from "@/repositories/Interface/IUserRepository";
import bcrypt from "bcrypt"
import { FileType, UserType } from "@/types/Type";
import { HttpResponse } from "@/constants/response.constant";
import { generateAccessToken, generateRefreshToken, } from "@/utils/jwt.util";
import { generateHttpError } from "@/utils/http-error.util";
import { HttpStatus } from "@/constants/status.constant";
import { ObjectId } from "mongoose";
import generateOtp from "@/utils/generate-otp.util";
import { env } from "@/config/env.config";
import { transporter } from "@/config/nodemailer.config";
import { redisClient } from "@/config/redis.config";
import { handleProfileImageUpload } from "@/config/cloudinary.config";
import { verifyToken } from "@/utils/jwt.util";

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
    let accessToken = await generateAccessToken(user._id as ObjectId, user.role as string)
    let refreshToken = await generateRefreshToken(user._id as ObjectId, user.role as string)

    console.log("ACCESS TOKEN >>>>>>>>  : ",accessToken)

    return { accessToken, refreshToken, user}
  }


async verifyOtp(otp: string, email: string, apiType: string): Promise<{accessToken?: string, refreshToken?: string, user: UserType}> {
  const storedDataString = await redisClient.get(email);

  console.log("verifyOtp from userSErvice >?> : ",storedDataString)

  if (!storedDataString) {
    throw generateHttpError(HttpStatus.BAD_REQUEST, HttpResponse.OTP_NOT_FOUND);
  }

  const storedData = JSON.parse(storedDataString);

  console.log("storedDAta from userSErvice >?> : ",storedData)

  if (storedData.otp !== otp) {
    throw generateHttpError(HttpStatus.BAD_REQUEST, HttpResponse.OTP_INCORRECT);
  }

  console.log("API TYPE ===>", apiType);

  if (apiType === "signup") {
    const user = {
      name: storedData.userData.name,
      email: storedData.userData.email,
      password: storedData.userData.password
    };

    const createdUser = await this.userRepository.createUser(user);
    if (!createdUser) {
      throw generateHttpError(HttpStatus.NOT_FOUND, HttpResponse.USER_CREATION_FAILED);
    }
    console.log("Create User from userService >?> : ",createdUser)

    const accessToken = await generateAccessToken(createdUser._id as ObjectId, createdUser.role as string);
    const refreshToken = await generateRefreshToken(createdUser._id as ObjectId, createdUser.role as string);

    return { accessToken, refreshToken, user: createdUser };

  } else if (apiType === "forgot-Password") {
    return { user: storedData.user };
  }

  throw generateHttpError(HttpStatus.BAD_REQUEST, "Invalid apiType");
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
    console.log("mailOptions : ",mailOptions)
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

    async updateProfile(id: string, profileImage: FileType | undefined): Promise<{user: UserType}> {        
        if (!profileImage) {            
            throw generateHttpError(HttpStatus.BAD_REQUEST, "Profile image is required")
        }

        const imageURL = await handleProfileImageUpload(profileImage.buffer)
        console.log("IMAGE URL >>>>> : ",imageURL)
        
        const user = await this.userRepository.findById(id)

        if (!user) {
            throw generateHttpError(HttpStatus.BAD_REQUEST, HttpResponse.USER_NOT_FOUND)
        }

        user.profilePicture = imageURL;
        await this.userRepository.updateUser(user);
        return {user}
    }

    async refreshToken(token: string): Promise<string> {
      const payload = verifyToken(token)

      if(!payload){
        throw generateHttpError(HttpStatus.BAD_REQUEST, HttpResponse.NO_TOKEN)
      }
      const user = await this.userRepository.findById(payload.userId)

      if(!user){
        throw generateHttpError(HttpStatus.NOT_FOUND , HttpResponse.USER_NOT_FOUND)
      }
      const accessToken = await generateAccessToken(user._id as ObjectId, user.role as string)
      return accessToken
    }

    async updateUserName(userId: string, name: string): Promise<{ newName: string; }> {
      const user = await this.userRepository.findById(userId)
      if(!user){
        throw generateHttpError(HttpStatus.BAD_REQUEST, HttpResponse.USER_NOT_FOUND)
      }
      user.name = name
      await this.userRepository.updateUser(user)
      const newName = user.name
      return {newName}
    }

    async getFreelancer(): Promise<{ name: string; email: string; profession: string; work_experience: string; working_days: string; active_hours: string; profilePicture: string }[]> {
      const freelancers = await this.userRepository.findFreelancer();
      return freelancers as { name: string; email: string; profession: string; work_experience: string; working_days: string; active_hours: string; profilePicture: string }[];
    }

  async getProfileImage(userId: string): Promise<{ user: UserType; }> {
    const user = await this.userRepository.findById(userId)
    if(!user) {
        throw generateHttpError(HttpStatus.BAD_REQUEST, HttpResponse.USER_NOT_FOUND)
    }
    return {user}
  }

  async forgetPassword(email: string): Promise<{ user: UserType; }> {
    const user = await this.userRepository.findByEmail(email)
    if(!user) {
      throw generateHttpError(HttpStatus.BAD_REQUEST, HttpResponse.USER_NOT_FOUND)
    }
    const newOtp = generateOtp()

    await redisClient.setEx(email, 300, JSON.stringify({otp:newOtp , user}))

    const mailOptions = {
      from: env.SENDER_EMAIL,
      to: email,
      subject: "6-digit OTP - Resend",
      text: `Your new OTP code is ${newOtp}`,
    };

    console.log("Mail Options >> : ",mailOptions)

    try {
      const info = await transporter.sendMail(mailOptions)
    } catch (err) {
      console.error("Failed to resend OTP email:", err);
      throw generateHttpError(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to send OTP email");
    }
    return {user}
  }

  async resetPassword(email: string, password: string): Promise<{ user: UserType; }> {
    const user = await this.userRepository.findByEmail(email)
    if(!user){
      throw generateHttpError(HttpStatus.BAD_REQUEST, HttpResponse.USER_NOT_FOUND)
    }
    user.password = await bcrypt.hash(password,10)
    await this.userRepository.updateUser(user)
    return {user}
  }

  async updateUserDetails(userId: string, userData: UserType): Promise<{ userDetails: UserType }> {
    const user = await this.userRepository.findById(userId);
    console.log("Update Details from userService > ",user)
    if (!user) {
      throw generateHttpError(HttpStatus.BAD_REQUEST, HttpResponse.USER_NOT_FOUND);
    }
    // ✅ Mutate the existing Mongoose document directly
    Object.assign(user, userData);
    await this.userRepository.updateUser(user);

    return { userDetails: user };
  }


}
