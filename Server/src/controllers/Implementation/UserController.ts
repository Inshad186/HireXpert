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
}

