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

    async getDashboardStats(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const {totalUsers, totalFreelancers, totalClients} = await this.adminService.getDashboardStats()
            res.status(HttpStatus.OK).json({ success: true, totalUsers, totalFreelancers, totalClients });
        } catch (error) {
            next()
        }
    }

    async getUsersList(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            console.log("get UsersList from adminController")
            const users = await this.adminService.getUsersList()
            res.status(HttpStatus.OK).json({success : true, users})
        } catch (error) {
            next()
        }
    }

async blockUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { userId } = req.body;

    const response = await this.adminService.blockUser(userId);

    res.status(200).json({ success: true, message: "User block status updated" }); // ✅ return success response
  } catch (error) {
    next(error); // ✅ good practice to send it to error handler
  }
}

}