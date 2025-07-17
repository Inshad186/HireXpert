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
            const { userId } = JSON.parse(req.headers['x-user-payload'] as string);
            const updatedUser = await this.freelancerService.updateProfile(userId, userData);
            res.status(HttpStatus.OK).json({ success: true, userDetails: updatedUser });
        } catch (error) {
            next()
        }
    }

    async createGig(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const gigData = req.body;
        const { userId } = JSON.parse(req.headers["x-user-payload"] as string);

        const fullGigData = {
        ...gigData,
        freelancer: userId,
        price: typeof gigData.price === "string" ? JSON.parse(gigData.price) : gigData.price,
        skills: gigData.skills.flat()
        };
        const gigId = await this.freelancerService.createGig(fullGigData);

        res.status(201).json({ success: true, message: "Gig created successfully", gigId,});
        } catch (error) {
            next(error);
        }
    }

}