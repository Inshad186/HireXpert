import { Request, Response, NextFunction } from "express";
import { IMessageController } from "../Interface/IMessageController";
import { HttpStatus } from "@/constants/status.constant";
import { IMessageService } from "@/services/Interface/IMessageService";

export class MessageController implements IMessageController {
    constructor(private messageService: IMessageService ){}

    async getOrderMessages(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { orderId } = req.params
            const message = await this.messageService.getOrderMessages(orderId)
            res.status(HttpStatus.OK).json({ success: true, message: message || []})
        } catch (error) {
            next(error)
        }
    }
}