import { Request, Response, NextFunction } from "express";
import { IUserService } from "@/services/Interface/IUserService";
import { IUserController } from "../Interface/IUserController";
import { HttpResponse } from "@/constants/response.constant";
import { HttpStatus } from "@/constants/status.constant";
import { redisClient } from "@/config/redis.config";
import { env } from "@/config/env.config";
import jwt from "jsonwebtoken";
import { verifyToken } from "@/utils/jwt.util";

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

  async verifyOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { otp, email } = req.body;
      console.log("REQUEST BODY $$$$$$$$$ >>>>>>> : ", req.body);
      const { accessToken, refreshToken, user } = await this.userService.verifyOtp(otp, email);

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      res.status(HttpStatus.CREATED).json({ accessToken, user });
    } catch (err) {
      next(err);
    }
  }

  async resendOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email } = req.body;
      if (!email) {
        res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: HttpResponse.INVALID_EMAIL });
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

  // async getProfileImage(req: Request, res: Response, next: NextFunction): Promise<void> {
  //   try {
  //     console.log("HEADERS >>> ", req.headers);
  //     const { userId } = JSON.parse(req.headers['x-user-payload'] as string);
  //     console.log("update PROFILE >>>>>>> : ",userId)
  //     const {user} = await this.userService.getProfileImage(userId)
  //     res.status(HttpStatus.OK).json({user})
  //   } catch (err) {
  //     next(err)
  //   }
  // }

  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    const refreshToken = req.cookies?.refreshToken;
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
