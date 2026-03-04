import { Request, Response, NextFunction } from "express";

export interface IMessageController {
    getOrderMessages(req: Request, res: Response, next: NextFunction) : Promise<void>
}