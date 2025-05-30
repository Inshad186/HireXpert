import { Request, Response, NextFunction } from "express";

export interface IAdminController {
    login( req:Request, res:Response, next:NextFunction ) : Promise<void>
    getTotalUsers(req: Request, res: Response, next: NextFunction) : Promise<void>
}