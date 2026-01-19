import { Request, Response, NextFunction } from "express";

export interface IWebhookController {
    handleStripeWebhook( req:Request, res:Response, next:NextFunction): Promise<void>
}