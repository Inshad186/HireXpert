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
      
      res.status(HttpStatus.OK).json({ message: HttpResponse.USER_CREATION_SUCCESS, user: newUser });
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
}

