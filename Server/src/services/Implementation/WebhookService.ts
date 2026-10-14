import { IWebhookService } from "../Interface/IWebhookService";
import { IOrderRepository } from "@/repositories/Interface/IOrderRepository";
import { INotificationService } from "../Interface/INotificationService";
import { env } from "@/config/env.config";
import { stripe } from "@/config/stripe.config";
import { io } from "@/socket/socket";
import { Types } from "mongoose";
import { OrderStatus } from "@/types/Type";

export class WebhookService implements IWebhookService {
    constructor(
        private orderRepository: IOrderRepository,
        private notificationService: INotificationService
    ) {}

    async verifyWebhookSignature(body: Buffer | string, signature: string): Promise<any> {
        try {
            const webhookSecret = env.STRIPE_WEBHOOK_SECRET

            if(!webhookSecret){
                throw new Error("STRIPE_WEBHOOK_SECRET not configured");
            }
            const event = stripe.webhooks.constructEvent(
                body,
                signature,
                webhookSecret
            );
            return event
        } catch (error) {
            console.error(error)
            throw error
        }
    }

  async handlePaymentIntentSucceeded(paymentIntent: any): Promise<void> {
    try {
      const { orderId, gigId, freelancerId, clientId } = paymentIntent.metadata;

      if (!orderId) {
        console.error("❌ No orderId in payment intent metadata",paymentIntent.id);
        return;
      }

      console.log(`✅ Processing payment_intent.succeeded for order: ${orderId}`);

      // Update order status to PENDING (waiting for freelancer to accept)
      const updatedOrder = await this.orderRepository.findByIdAndUpdate(orderId,
        {
          status: OrderStatus.PENDING,
          paymentDetails: {
            status: "SUCCEEDED",
            paidAt: new Date()
          }
        }
      );

      if (!updatedOrder) {
        console.error(`❌ Order not found: ${orderId}`);
        return;
      }

      // Create notification for freelancer
      const notificationData = {
        freelancer: new Types.ObjectId(freelancerId),
        orderId: new Types.ObjectId(orderId),
        type: "new_order" as const,
        title: "New Order Received! 🎉",
        message: `New order placed for ₹${paymentIntent.amount / 100}`,
        gigTitle: gigId,
        clientName: clientId,
        isRead: false,
      };

      await this.notificationService.createNotification(notificationData);

      // Emit real-time notification via Socket.io
      io.to(`user_${freelancerId}`).emit("notification", {
        type: "new_order",
        title: "New Order Received! 🎉",
        message: `New order placed for ₹${paymentIntent.amount / 100}`,
        orderId,
        timestamp: new Date(),
        isRead: false,
      });

      console.log(`✅ Payment succeeded & order updated for order: ${orderId}`);
    } catch (error) {
      console.error("❌ Error handling payment_intent.succeeded webhook:", error);
      throw error;
    }
  }
}