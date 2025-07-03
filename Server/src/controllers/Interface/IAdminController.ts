import { Request, Response, NextFunction } from "express";

export interface IAdminController {
    login( req:Request, res:Response, next:NextFunction ) : Promise<void>
    getDashboardStats(req: Request, res: Response, next:NextFunction) : Promise<void>
    getUsersList(req: Request, res: Response, next:NextFunction) : Promise<void>;
    blockUser(req:Request, res:Response, next:NextFunction): Promise<void>;
    getCategories(req:Request, res:Response, next:NextFunction) : Promise<void>
    getSkills(req:Request, res:Response, next:NextFunction) : Promise<void>;
    editSkills(req:Request, res:Response, next:NextFunction) : Promise<void>;
    addSkills(req:Request, res:Response, next:NextFunction) : Promise<void>;
}