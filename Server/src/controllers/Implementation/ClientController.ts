import { Request, Response, NextFunction } from "express";
import { HttpStatus } from "@/constants/status.constant";
import { HttpResponse } from "@/constants/response.constant";
import { IClientController } from "../Interface/IClientController";
import { IClientService } from "@/services/Interface/IClientService";

export class ClientController implements IClientController {
    constructor(private clientService : IClientService){}

    async updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userData = req.body;
            console.log("😡😡😡😡 userDetails in userController : > ? ",userData)
            const { userId } = JSON.parse(req.headers['x-user-payload'] as string);
            console.log("************************ : ",userId)
            const updatedUser = await this.clientService.updateProfile(userId, userData);
            console.log("userDetails in userController : > ??? ",updatedUser)
            res.status(HttpStatus.OK).json({ success: true, userDetails: updatedUser });
        } catch (error) {
            next()
        }
    }
}