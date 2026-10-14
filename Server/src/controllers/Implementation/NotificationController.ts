import { Request, Response, NextFunction } from "express";
import { INotificationController } from "../Interface/INotitficationController";
import { Types } from "mongoose";
import { HttpStatus } from "@/constants/status.constant";
import { INotificationService } from "@/services/Interface/INotificationService";

export class NotificationController implements INotificationController {
    constructor(private notificationService: INotificationService){}

  async getNotifications(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId } = JSON.parse(req.headers["x-user-payload"] as string);

      if (!Types.ObjectId.isValid(userId)) {
        res.status(HttpStatus.BAD_REQUEST).json({success: false, message: "Invalid user ID" });
        return;
      }
      const notifications = await this.notificationService.getNotifications(userId);
      res.status(HttpStatus.OK).json({ success: true, notifications });
    } catch (error) {
      next(error);
    }
  }

  async markAsRead(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { notificationId } = req.params;
      const notification = await this.notificationService.markAsRead(notificationId)
      res.status(HttpStatus.OK).json({ success: true, notification})
    } catch (error) {
      next(error)
    }
  }

  async deleteNotify(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { notificationId } = req.params;
      await this.notificationService.deleteNotify(notificationId)
      res.status(HttpStatus.OK).json({ success: true})
    } catch (error) {
      next(error)
    }
  }

}