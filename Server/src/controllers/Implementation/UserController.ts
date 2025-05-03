import { Request, Response, NextFunction } from "express";
import { IUserService } from "@/services/Interface/IUserService";
import { IUserController } from "../Interface/IUserController";
import { HttpResponse } from "@/constants/response.constant";
import { HttpStatus } from "@/constants/status.constant";

export class UserController implements IUserController{
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
      const {email, password} = req.body

      const tokens = await this.userService.login(email, password)

      res.cookie("refreshToken", tokens.refreshToken, {
        httpOnly: true,
        secure: false,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: "strict",
      });

      res.status(HttpStatus.OK).json({accessToken : tokens.accessToken})
    } catch (err) {
      next()
    }
  }

  async verifyOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { otp, email } = req.body;
      console.log("REQUEST BODY $$$$$$$$$ >>>>>>> : ",req.body)
      const {accessToken, refreshToken, user} = await this.userService.verifyOtp(otp, email)

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true, 
        secure: true,
        sameSite: "strict", 
        maxAge: 7 * 24 * 60 * 60 * 1000 
    });
    res.status(HttpStatus.CREATED).json({ accessToken, user });
    } catch (err) {
      next(err);
    }
  }

  async resendOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const {email} = req.body
      if(!email){
        res.status(HttpStatus.BAD_REQUEST).json({message:HttpResponse.INVALID_EMAIL});
        return
      }
      await this.userService.resendOtp(email)
      res.status(HttpStatus.OK).json({ message: "OTP resent successfully" });
    } catch (err) {
      next(err)
    }
  }
}

