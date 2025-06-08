import { Request, Response, NextFunction } from "express";

export interface IAdminController {
    login( req:Request, res:Response, next:NextFunction ) : Promise<void>
    getDashboardStats(req: Request, res: Response, next:NextFunction) : Promise<void>
    getUsersList(req: Request, res: Response, next:NextFunction) : Promise<void>;
    blockUser(req:Request, res:Response, next:NextFunction): Promise<void>;
}