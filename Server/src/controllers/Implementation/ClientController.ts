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
            if(!userData) res.status(HttpStatus.BAD_REQUEST).json({success: false, message: "Missing required field"})

            const { userId } = JSON.parse(req.headers['x-user-payload'] as string);
            const updatedUser = await this.clientService.updateProfile(userId, userData);
            res.status(HttpStatus.OK).json({ success: true, userDetails : updatedUser });
        } catch (error) {
            next(error)
        }
    }

    async getGigs(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const gigs = await this.clientService.getGigs()
            res.status(HttpStatus.OK).json({success: true, gigs})
        } catch (error) {
            next(error)
        }
    }

    async getProjectDetail(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { projectId } = req.params
            if(!projectId) res.status(HttpStatus.BAD_REQUEST).json({sucess: false, message: "Missing ProjectId"})

            const projectDetails = await this.clientService.getGigDetails(projectId)
            res.status(HttpStatus.OK).json({success:true, projectDetails})
        } catch (error) {
            next(error)
        }
    }

    async createOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const {gigId, freelancerId, requirements, selectedPlan:plan} = req.body
            if(!gigId || !freelancerId || !requirements || !plan){
                res.status(HttpStatus.BAD_REQUEST).json({ success: false, message: "Missing required fields"})
                return;
            }
            const validPlans = ["basic", "standard", "premium"]
            if(!validPlans.includes(plan)){
                res.status(HttpStatus.BAD_REQUEST).json({ success: false, message: "Invalid plan selected"})
            }
            const { userId } = JSON.parse(req.headers['x-user-payload'] as string);
            const order = await this.clientService.createOrder(userId, freelancerId, gigId, requirements, plan)
            res.status(HttpStatus.CREATED).json({ success: true, order})
        } catch (error) {
            next(error)
        }
    }

    async getMyOrders(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { userId } = JSON.parse(req.headers['x-user-payload'] as string);
            const OrderDetail = await this.clientService.getMyOrders(userId)
            res.status(HttpStatus.OK).json({success: true, OrderDetail})
        } catch (error) {
            next(error)
        }
    }
}