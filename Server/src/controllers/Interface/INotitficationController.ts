import { Request, Response, NextFunction } from "express";

export interface INotificationController {
    getNotifications(req: Request, res: Response, next: NextFunction): Promise<void>;
    markAsRead(req: Request, res: Response, next: NextFunction): Promise<void>;
    deleteNotify(req: Request, res: Response, next: NextFunction): Promise<void>;
}