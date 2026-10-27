import { Request, Response, NextFunction } from "express";
import { HttpStatus } from "@/constants/status.constant";
import { HttpResponse } from "@/constants/response.constant";
import { IClientController } from "../Interface/IClientController";
import { IClientService } from "@/services/Interface/IClientService";
import { GigFilters } from "@/types/Type";

export class ClientController implements IClientController {
    constructor(private clientService : IClientService){}

    async updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userData = req.body;
            const { userId } = JSON.parse(req.headers['x-user-payload'] as string);
            const updatedUser = await this.clientService.updateProfile(userId, userData);
            res.status(HttpStatus.OK).json({ success: true, userDetails : updatedUser });
        } catch (error) {
            next(error)
        }
    }


    async getGigs(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const toNumber = (v: unknown): number | undefined => {
                if (v === undefined || v === "") return undefined;
                const n = Number(v);
                return Number.isNaN(n) ? undefined : n;
            };
            const { search, category, skills, minPrice, maxPrice, minRating } = req.query;

            const filters: GigFilters = {
                search: (search as string | undefined)?.trim() || undefined,
                category: (category as string | undefined) || undefined,
                skills: skills ? (skills as string).split(",") : undefined,
                minPrice: toNumber(minPrice),
                maxPrice: toNumber(maxPrice),
                minRating: toNumber(minRating),
            };

            const gigs = await this.clientService.getGigs(filters);
            res.status(HttpStatus.OK).json({ success: true, gigs });
        } catch (error) {
            next(error);
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

    async createPaymentIntent(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { gigId, plan } = req.body;
            const { userId } = JSON.parse(req.headers["x-user-payload"] as string);
            if(!gigId || !plan){
                res.status(HttpStatus.BAD_REQUEST).json({ success: false, message: "Missing required fields"})
                return;
            }
            const {clientSecret, paymentIntentId} = await this.clientService.createPaymentIntent(userId, gigId, plan)
            res.status(HttpStatus.OK).json({success: true, clientSecret, paymentIntentId})
        } catch (error) {
            next()
        }
    }

    async createOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const {gigId, requirements, selectedPlan:plan, paymentIntentId } = req.body

            if(!gigId || !requirements || !plan){
                res.status(HttpStatus.BAD_REQUEST).json({ success: false, message: "Missing required fields"})
                return;
            }
            const validPlans = ["basic", "standard", "premium"]
            if(!validPlans.includes(plan)){
                res.status(HttpStatus.BAD_REQUEST).json({ success: false, message: "Invalid plan selected"})
            }
            const { userId } = JSON.parse(req.headers['x-user-payload'] as string);
            const order = await this.clientService.createOrder(userId, gigId, requirements, plan, paymentIntentId)
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
            const { userId } = JSON.parse(req.headers["x-user-payload"] as string);
            await this.clientService.acceptOrders(orderId, userId, feedback, rating)
            res.status(HttpStatus.OK).json({ success: true})
        } catch (error) {
            next()
        }
    }

    async requestRevision(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { orderId } = req.params
            const { userId } = JSON.parse(req.headers["x-user-payload"] as string);
            const { revisionReason } = req.body
            await this.clientService.requestRivision(orderId, userId, revisionReason)
            res.status(HttpStatus.OK).json({ success: true })
        } catch (error) {
            next();
        }
    }
}