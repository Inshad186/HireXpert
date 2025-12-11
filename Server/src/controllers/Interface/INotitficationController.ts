import { Request, Response, NextFunction } from "express";

export interface INotificationController {
    getNotifications(req: Request, res: Response, next: NextFunction): Promise<void>;
}