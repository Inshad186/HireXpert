import { Request, Response, NextFunction } from "express";

export interface IFreelancerController {
    updateProfile(req:Request, res:Response, next:NextFunction) : Promise<void>
    createGig(req:Request, res:Response, next:NextFunction) : Promise<void>
    getGigList(req:Request, res:Response, next:NextFunction) : Promise<void>
    updateGigStatus(req:Request, res:Response, next:NextFunction) : Promise<void>
    getFreelancerDashStats(req:Request, res:Response, next:NextFunction) : Promise<void>
    getOrderList(req:Request, res:Response, next:NextFunction) : Promise<void>
    getOrders(req:Request, res:Response, next:NextFunction) : Promise<void>
    acceptOrder(req: Request, res: Response, next: NextFunction): Promise<void>
    rejectOrder(req: Request, res: Response, next: NextFunction): Promise<void>
    inprogressOrder(req: Request, res: Response, next: NextFunction): Promise<void>
    deliveryOrder(req: Request, res: Response, next: NextFunction): Promise<void>
    startStripeOnboarding(req: Request, res: Response, next: NextFunction): Promise<void>
    getStripeStatus(req: Request, res: Response, next: NextFunction): Promise<void>
}