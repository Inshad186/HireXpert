import { Request, Response, NextFunction } from "express";
import { IUserService } from "@/services/Interface/IUserService";

export class UserController {
  constructor(private userService: IUserService) {}

  async signup(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const newUser = await this.userService.signup(req.body);
      res.status(201).json({ message: "User created", user: newUser });
    } catch (error) {
      next(error);
    }
  }
}
