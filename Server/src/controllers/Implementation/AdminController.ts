import { Request, Response, NextFunction } from "express";
import { IAdminController } from "../Interface/IAdminController";
import { IAdminService } from "@/services/Interface/IAdminService";
import { HttpStatus } from "@/constants/status.constant";
import { HttpResponse } from "@/constants/response.constant";

export class AdminController implements IAdminController {
    constructor(private adminService:IAdminService){}
    
    async login(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const {email, password} = req.body
            const {accessToken, refreshToken, admin} = await this.adminService.login(email, password)
            res.cookie("refreshToken",refreshToken,{
                httpOnly : true,
                secure : true,
                sameSite : "strict",
                maxAge : 7 * 24 * 60 * 60 * 1000
            })
            res.status(HttpStatus.OK).json({message:HttpResponse.LOGIN_SUCCESS, accessToken, admin})
        } catch (error) {
            next(error)
        }
    }

    async getTotalUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const {totalUsers} = await this.adminService.getTotalUsers()
            res.status(HttpStatus.OK).json({ success: true, totalUsers });
        } catch (error) {
            next()
        }
    }
}