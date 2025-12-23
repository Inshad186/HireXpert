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
      const { userId } = JSON.parse(req.headers["x-user-payload"] as string);

      const fullGigData = { ...gigData, 
        freelancer: userId,
        pricing: typeof gigData.pricing === "string"? JSON.parse(gigData.pricing): gigData.pricing,
        skills: JSON.parse(gigData.skills),
      };
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

  async getFreelancerDashStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId } = JSON.parse(req.headers["x-user-payload"] as string);
      const {totalOrders, myGigs, activeOrders} = await this.freelancerService.getFreelancerDashStats(userId)
      console.log("FREELANCER ID : ",userId)
      console.log("TOTAL ORDERS : ",totalOrders)
      console.log("MY GIGS : ",myGigs)
      console.log("ACTIVE ORDERS : ",activeOrders)
      res.status(HttpStatus.OK).json({ success: true, message: "Gig Status Updated", totalOrders, myGigs, activeOrders});
    } catch (error) {
      next(error)
    }
  }

  async getOrderList(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId } = JSON.parse(req.headers["x-user-payload"] as string)
      const orderDetails = await this.freelancerService.getOrderList(userId)
      res.status(HttpStatus.OK).json({ success: true, message: "Order Listed Successfully", orderDetails})
    } catch (error) {
      next(error)
    }
  }

  async getOrders(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { orderId } = req.params;
      console.log("getOrders from Freelancer Controller: ",orderId)
      const orders = await this.freelancerService.getOrders(orderId)
      console.log("🔴🔴🔴🔴🔴🔴🔴 ",orders)
      res.status(HttpStatus.OK).json({ success: true, message: "Get orders Successfully", orders})
    } catch (error) {
      next(error)
    }
  }

  async acceptOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const {orderId} = req.params;
      console.log("accept orders from Freelancer Controller: ",orderId)
      const orderAccepted = await this.freelancerService.acceptOrder(orderId)
      res.status(HttpStatus.OK).json({ success: true, orderAccepted})
    } catch (error) {
      next(error)
    }
  }

  async rejectOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { orderId, reason } = req.params;
      await this.freelancerService.rejectOrder(orderId, reason)
      res.status(HttpStatus.OK).json({ success: true})
    } catch (error) {
      next(error)
    }
  }
}
