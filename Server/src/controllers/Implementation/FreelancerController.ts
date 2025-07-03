import { Request, Response, NextFunction } from "express";
import { HttpStatus } from "@/constants/status.constant";
import { HttpResponse } from "@/constants/response.constant";
import { IFreelancerController } from "../Interface/IFreelacerController";
import { IFreelancerService } from "@/services/Interface/IFreelancerService";

export class FreelancerController implements IFreelancerController {
    constructor(private freelancerService : IFreelancerService) {}

    async updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userData = req.body;
            console.log("😡😡freeleancer😡😡 userDetails in userController : > ? ",userData)
            const { userId } = JSON.parse(req.headers['x-user-payload'] as string);
            const updatedUser = await this.freelancerService.updateProfile(userId, userData);
            console.log("userDetails in userController : > freelancer ??? ",updatedUser)
            res.status(HttpStatus.OK).json({ success: true, userDetails: updatedUser });
        } catch (error) {
            next()
        }
    }
}