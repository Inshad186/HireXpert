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
}