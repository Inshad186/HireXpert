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

    // async getFreelancerReviews(req: Request, res: Response, next: NextFunction): Promise<void> {
    //     try {
    //         const { projectId } = req.params
    //         console.log("Gig IDDD : ", projectId)
    //         const gigDetails = await this.clientService.getFreelancerReviews(projectId)
    //         console.log("Gig Detailsssss : ", gigDetails)
    //     } catch (error) {

    //     }
    // }

    async createPaymentIntent(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { gigId, freelancerId, price } = req.body;
            const { userId } = JSON.parse(req.headers["x-user-payload"] as string);
            if(!gigId || !freelancerId || !price){
                res.status(HttpStatus.BAD_REQUEST).json({ success: false, message: "Missing required fields"})
                return;
            }
            const {clientSecret, paymentIntentId} = await this.clientService.createPaymentIntent(userId, freelancerId, gigId, price)
            res.status(HttpStatus.OK).json({success: true, clientSecret, paymentIntentId})
        } catch (error) {
            next()
        }
    }

    async createOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const {freelancerId, gigId, requirements, selectedPlan:plan, paymentIntentId, price } = req.body
            if(!gigId || !freelancerId || !requirements || !plan){
                res.status(HttpStatus.BAD_REQUEST).json({ success: false, message: "Missing required fields"})
                return;
            }
            const validPlans = ["basic", "standard", "premium"]
            if(!validPlans.includes(plan)){
                res.status(HttpStatus.BAD_REQUEST).json({ success: false, message: "Invalid plan selected"})
            }
            const { userId } = JSON.parse(req.headers['x-user-payload'] as string);
            const order = await this.clientService.createOrder(userId, freelancerId, gigId, requirements, plan, paymentIntentId, price)
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

    async acceptOrders(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { orderId } = req.params;
            const {feedback, rating} = req.body
            await this.clientService.acceptOrders(orderId, feedback, rating)
            res.status(HttpStatus.OK).json({ success: true})
        } catch (error) {
            next()
        }
    }

    async requestRevision(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { orderId } = req.params
            const { revisionReason, revisionCount } = req.body
            console.log("ORDER : ", orderId)
            console.log("REQUEST REVISION : ", revisionReason)
            console.log("REVISION COUNT : ", revisionCount)
            await this.clientService.requestRivision(orderId, revisionReason, revisionCount)
            res.status(HttpStatus.OK).json({ success: true })
        } catch (error) {
            next();
        }
    }
}