import { Request, Response, NextFunction } from "express";
import { IWebhookController } from "../Interface/IWebhookController";
import { IWebhookService } from "@/services/Interface/IWebhookService";
import { HttpStatus } from "@/constants/status.constant";

export class WebhookController implements IWebhookController {
    constructor(private webhookService: IWebhookService){}

    async handleStripeWebhook(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const signature = req.headers["stripe-signature"] as string;
            const event = await this.webhookService.verifyWebhookSignature(req.body, signature)
            console.log(`📨 Received Stripe webhook event: ${event.type}`);
            switch(event.type){
                case "payment_intent.succeeded":
                    await this.webhookService.handlePaymentIntentSucceeded(event.data.Object)
                    break;

                default: console.log(`⚠️ Unhandled Stripe event type: ${event.type} (ID: ${event.id})`)    
            }
            res.status(HttpStatus.OK).json({ received: true });
        } catch (error) {
            next()
        }
    }
}