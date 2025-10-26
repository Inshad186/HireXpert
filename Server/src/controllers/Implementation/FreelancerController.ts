import { Request, Response, NextFunction } from "express";
import { HttpStatus } from "@/constants/status.constant";
import { HttpResponse } from "@/constants/response.constant";
import { IFreelancerController } from "../Interface/IFreelacerController";
import { IFreelancerService } from "@/services/Interface/IFreelancerService";

export class FreelancerController implements IFreelancerController {
  constructor(private freelancerService: IFreelancerService) {}

  async updateProfile( req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userData = req.body;
      console.log("USER DATA >>>> ? > : ", userData);
      const { userId } = JSON.parse(req.headers["x-user-payload"] as string);
      const updatedUser = await this.freelancerService.updateProfile(userId, userData);
      res.status(HttpStatus.OK).json({ success: true, userDetails: updatedUser });
    } catch (error) {
      next();
    }
  }

  async createGig( req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const gigData = req.body;
      const gallery = req.files as Express.Multer.File[];
      console.log("Gig DATA", gigData)

      const { userId } = JSON.parse(req.headers["x-user-payload"] as string);

      const fullGigData = { ...gigData, 
        freelancer: userId,
        pricing: typeof gigData.pricing === "string"? JSON.parse(gigData.pricing): gigData.pricing,
        skills: JSON.parse(gigData.skills),
      };
      console.log("Full Gig DATA :",fullGigData)
      const gigId = await this.freelancerService.createGig( fullGigData, gallery);

      res.status(201).json({ success: true, message: "Gig created successfully", gigId });
    } catch (error) {
      next(error);
    }
  }

  async getGigList( req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId } = JSON.parse(req.headers["x-user-payload"] as string);
      const gigDetails = await this.freelancerService.getGigList(userId);
      res.status(HttpStatus.OK).json({ success: true, message: "Gig listed Successfulyy", gigDetails,});
    } catch (error) {
      next(error);
    }
  }

  async updateGigStatus( req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id, currentStatus } = req.body;
      const gigStatus = await this.freelancerService.updateGigStatus( id, currentStatus);
      res.status(HttpStatus.OK).json({ success: true, message: "Gig Status Updated", gigStatus });
    } catch (error) {
      next(error);
    }
  }
}
