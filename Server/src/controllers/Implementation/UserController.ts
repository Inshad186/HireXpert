import { Request, Response, NextFunction } from "express";
import { IUserService } from "@/services/Interface/IUserService";
import { IUserController } from "../Interface/IUserController";
import { HttpResponse } from "@/constants/response.constant";
import { HttpStatus } from "@/constants/status.constant";
import { redisClient } from "@/config/redis.config";
import { env } from "@/config/env.config";
import jwt from "jsonwebtoken";

export class UserController implements IUserController {
  constructor(private userService: IUserService) {}

  async signup(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const newUser = await this.userService.signup(req.body);

      res.status(HttpStatus.OK).json({ message: HttpResponse.USER_CREATION_SUCCESS, email: newUser });
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;

      const { accessToken, refreshToken, user } = await this.userService.login( email, password );

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: "strict",
      });

      res.status(HttpStatus.OK).json({ accessToken, user });
    } catch (err) {
      next();
    }
  }

  async googleAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const {...userData} = req.body.user
      const { accessToken, refreshToken, user } = await this.userService.googleAuth(userData)

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: "strict",
      });

      res.status(HttpStatus.OK).json({ accessToken, user });
    } catch (error) {
      next()
    }
  }

  async verifyOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { otp, email, apiType } = req.body;
      console.log("API TYPE ===>", apiType);
      console.log("REQUEST BODY $$$$$$$$$ >>>>>>> : ", req.body);
      const { accessToken, refreshToken, user } = await this.userService.verifyOtp(otp, email, apiType);

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      res.status(HttpStatus.CREATED).json({ accessToken, user});
    } catch (err) {
      next(err);
    }
  }

  async resendOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email } = req.body;
      console.log("RESEND OTP ? >> ? : ",email)
      if (!email) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: HttpResponse.INVALID_EMAIL });
        return;
      }
      await this.userService.resendOtp(email);
      res.status(HttpStatus.OK).json({ message: "OTP resent successfully" });
    } catch (err) {
      next(err);
    }
  }

  async assignRole(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const {role,email} = req.body
      const { userRole } = await this.userService.assignRole(role, email)
      res.status(HttpStatus.OK).json({ userRole});
    } catch (err) {
      next(err)
    }
  }

  async updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.body.userId;
      const profileImage = req.file;

      console.log("USER ID >>>>>>>>>> : ",userId)
      console.log("PROFILE IMAGE >>>>>>>> : ",profileImage)
      
      const {user} = await this.userService.updateProfile(userId, profileImage)
      res.status(HttpStatus.OK).json({user})
    } catch (err) {
      next(err)
    }
  }

  async updateUserName(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      console.log("REQUEST BODY FROM UPDATEUSER NAME",req.body)
      const {name} = req.body
      const {userId} = JSON.parse(req.headers["x-user-payload"] as string)
      console.log("???????????" , userId)
      const newName = await this.userService.updateUserName(userId, name)
      res.status(HttpStatus.OK).json({newName})
    } catch (err) {
      next(err)
    }
  }

  async refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const refreshToken = req.cookies.refreshToken
      console.log("Refresh Token from userController : ",refreshToken)
      if(!refreshToken){
        res.status(HttpStatus.BAD_REQUEST).json({ message: HttpResponse.NO_TOKEN });
        return;
      }
      const accessToken = await this.userService.refreshToken(refreshToken)
      console.log("Access Token from userController",accessToken)
      res.status(HttpStatus.OK).json({accessToken})
    } catch (err) {
      next(err)
    }
  }

  async getProfileImage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId } = JSON.parse(req.headers['x-user-payload'] as string)
      console.log("update PROFILE >>>>>>> : ",userId)
      const {user} = await this.userService.getProfileImage(userId)
      res.status(HttpStatus.OK).json({user})
    } catch (err) {
      next(err)
    }
  }

  async getFreelancer(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const freelancers = await this.userService.getFreelancer()
      res.status(HttpStatus.OK).json({ success: true, data: freelancers });
    } catch (err) {
      next(err)
    }
  }

  async forgetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const {email} = req.body
      const response = await this.userService.forgetPassword(email)
      console.log("Forget Password from userController : ",response)
      res.status(HttpStatus.OK).json({ success: true, user:response });
    } catch (error) {
      next()
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const {email, password} = req.body
      const user = await this.userService.resetPassword(email, password)
      res.status(HttpStatus.OK).json({ success: true, user });
    } catch (error) {
      next()
    }
  }

  async updateUserDetails(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userData = req.body;
      console.log("userDetails in userController : > ? ",userData)
      const { userId } = JSON.parse(req.headers['x-user-payload'] as string);
      const updatedUser = await this.userService.updateUserDetails(userId, userData);
      console.log("userDetails in userController : > ??? ",updatedUser)
      res.status(HttpStatus.OK).json({ success: true, userDetails: updatedUser });
    } catch (error) {
      next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    const refreshToken = req.cookies?.refreshToken;
    console.log("REFRESH TOKEN >>> : ",refreshToken)
    if (refreshToken) {
      const decoded = jwt.verify(
        refreshToken,
        env.JWT_REFRESH_SECRET as string
      ) as { userId: string };
      if (decoded?.userId) {
        await redisClient.del(decoded.userId);
      }
    }
    await res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });
    res.status(HttpStatus.OK).json({ message: "Logout successfully" });
  }
}
