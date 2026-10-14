import { ClientProfileType, GigFilters, GigType, OrderStatus, OrderType } from "@/types/Type";
import { GigWithFreelancer, IClientService } from "../Interface/IClientService";
import { IClientRepository } from "@/repositories/Interface/IClientRepository";
import { HttpStatus } from "@/constants/status.constant";
import { HttpResponse } from "@/constants/response.constant";
import { generateHttpError } from "@/utils/http-error.util";
import { IGigRepository } from "@/repositories/Interface/IGigRepository";
import { IFreelancerRepository } from "@/repositories/Interface/IFreelancerRepository";
import { IUserRepository } from "@/repositories/Interface/IUserRepository";
import { IOrderRepository } from "@/repositories/Interface/IOrderRepository";
import { Types } from "mongoose";
import { io } from "@/socket/socket";
import { NotificationService } from "./NotificationService";
import { stripe } from "@/config/stripe.config";

const PLATFORM_FEE_RATE = 0.2;

export class ClientService implements IClientService {
  constructor(
    private clientRepository: IClientRepository,
    private gigRepository: IGigRepository,
    private freelancerRepository: IFreelancerRepository,
    private userRepository: IUserRepository,
    private orderRepository: IOrderRepository,
    private notificationService: NotificationService
  ) {}

  async updateProfile( userId: string, userData: ClientProfileType ): Promise<ClientProfileType> {
    try {
      const user = await this.clientRepository.findById(userId)
      if (!user) {
        throw generateHttpError( HttpStatus.BAD_REQUEST, HttpResponse.USER_NOT_FOUND );
      }
      Object.assign(user, userData);
      await this.clientRepository.findByIdAndUpdate(userId, user);
      return user 
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getGigs(filters: GigFilters): Promise<GigType[]> {
    try {
      return await this.gigRepository.findGigs(filters)
    } catch (error) {
      console.error(error)
      throw error;
    }
  }

  async getGigDetails(gigId: string): Promise<GigWithFreelancer> {
    try {
      const gigDetails = await this.gigRepository.findById(gigId)
      if(!gigDetails){
        throw generateHttpError(HttpStatus.BAD_REQUEST, HttpResponse.INVALID_CREDENTIALS)
      }
      const freelancerId = gigDetails.freelancer?.toString()
      const freelancerDetails = await this.freelancerRepository.findById(freelancerId as string)

      if(!freelancerDetails){
        throw generateHttpError(HttpStatus.BAD_REQUEST, HttpResponse.USER_NOT_FOUND)
      }
      const userDetails = await this.userRepository.findById(freelancerId as string)
      const freelancerReviews = await this.orderRepository.getFreelancerReviews(freelancerId as string)
      return {
        gig : gigDetails,
        freelancer : freelancerDetails,
        profileImage : userDetails?.profilePicture as string,
        freelancerReviews: freelancerReviews
      }
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  async createPaymentIntent(userId: string, gigId: string, plan: string): Promise<{ clientSecret: string; paymentIntentId: string }> {
    try {
      if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(gigId)) {
        throw new Error("Invalid ID format");
      }
      if (!["basic", "standard", "premium"].includes(plan)) {
        throw new Error("Invalid plan");
      }

      const gig: any = await this.gigRepository.findById(gigId);
      if (!gig || !gig.isActive) throw new Error("This gig is not available");

      const price = gig.pricing?.[plan]?.price;
      if (!price) throw new Error("This plan is not available");

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(price * 100),
        currency: "usd",
        payment_method_types: ["card"],
        metadata: { gigId, plan, freelancerId: gig.freelancer.toString(), clientId: userId },
      });

      return { clientSecret: paymentIntent.client_secret as string, paymentIntentId: paymentIntent.id };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async createOrder(userId: string, gigId: string, requirements: string, selectedPlan: string, paymentIntentId: string): Promise<OrderType> {
    try {
      if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(gigId)) {
        throw new Error("Invalid ID format");
      }

      if (!requirements.trim()) {
        throw new Error("Requirements cannot be empty");
      }

      if(!paymentIntentId){
        throw new Error("Payment intent ID is required")
      }

      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)

      if(paymentIntent.status !== "succeeded" && paymentIntent.status !== "requires_capture"){
        throw new Error(`Payment failed ${paymentIntent.status}`)
      }

      if (
        paymentIntent.metadata.clientId !== userId ||
        paymentIntent.metadata.gigId !== gigId ||
        paymentIntent.metadata.plan !== selectedPlan
      ) {
        throw new Error("Payment does not match this order");
      }

      const freelancerId = paymentIntent.metadata.freelancerId;

      // Create order
      const details: Partial<OrderType> = {
        client: new Types.ObjectId(userId),
        freelancer: new Types.ObjectId(freelancerId),
        gig: new Types.ObjectId(gigId),
        requirements: requirements.trim(),
        plan: selectedPlan as any,
        status: OrderStatus.PENDING,
        paymentDetails:{
          stripePaymentIntentId: paymentIntentId,
          amount: paymentIntent.amount / 100,
          currency: paymentIntent.currency,
          status: "SUCCEEDED",
          paidAt: new Date()
        },
        escrowDetails: { escrowStatus: "HELD" },   // holdUntilDate is set at delivery
        statusHistory: [{ status: OrderStatus.PENDING, timestamp: new Date(), changedBy: "client" }],
      };

      const order = await this.orderRepository.create(details);
      // Fetch gig and client details
      const gigData = await this.gigRepository.findById(gigId);
      const clientData = await this.userRepository.findById(userId);

      // Create notification using service
      const notificationData = {
        freelancer: new Types.ObjectId(freelancerId),
        orderId: order._id,
        type: "new_order" as const,
        title: "New Order Received! 🎉",
        message: `${clientData?.name || "A client"} ordered ${gigData?.title || "your gig"}`,
        gigTitle: gigData?.title,
        clientName: clientData?.name,
        isRead: false,
      };
      const notification = await this.notificationService.createNotification(notificationData);

      // Emit real-time notification via Socket.io
      io.to(`user_${freelancerId}`).emit("notification", {
        _id: notification.id,
        type: "new_order",
        title: "New Order Received! 🎉",
        message: `${clientData?.name || "A client"} ordered "${gigData?.title || "your gig"}"`,
        gigTitle: gigData?.title,
        clientName: clientData?.name,
        timestamp: new Date(),
        isRead: false,
      });
      console.log(`FreelancerID from Client Service: ${freelancerId}`);
      return order;
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  }

  async getMyOrders(userId: string): Promise<OrderType[]> {
    try {
      if(!Types.ObjectId.isValid(userId)){
        throw new Error("Invalid user ID format")
      }
      const OrderDetail = await this.orderRepository.findByClient(userId)
      return OrderDetail
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  async releasePayment( orderId: string, by: "client" | "system", reason: string, extra: Record<string, unknown> = {}): Promise<OrderType | null> {
    const order = await this.orderRepository.findById(orderId);
    if (!order) throw new Error("Order not found");

    // Release only delivered work, and only while the money is still held
    if (order.status !== OrderStatus.DELIVERED || order.escrowDetails?.escrowStatus !== "HELD") {
      throw new Error("Payment cannot be released");
    }

    const payment = order.paymentDetails;
    if (!payment?.stripePaymentIntentId || payment.amount === undefined || !payment.currency) {
      throw new Error("Payment details are incomplete for this order");
    }
    const { stripePaymentIntentId, amount, currency } = payment;

    const freelancer = await this.freelancerRepository.findById(order.freelancer.toString());
    if (!freelancer?.stripeConnectedAccountId) {
      throw new Error("Freelancer has not connected a Stripe account");
    }

    const account = await stripe.accounts.retrieve(freelancer.stripeConnectedAccountId);
    if (!account.charges_enabled || !account.payouts_enabled) {
      throw new Error("Freelancer's Stripe account is not ready");
    }

    // Your amounts are in whole dollars, so convert to cents for Stripe
    const totalCents = Math.round(payment.amount * 100);
    const feeCents = Math.round(totalCents * PLATFORM_FEE_RATE);
    const freelancerCents = totalCents - feeCents;

    // Link the transfer to the client's original payment
    const intent = await stripe.paymentIntents.retrieve(payment.stripePaymentIntentId);

    const transfer = await stripe.transfers.create(
      {
        amount: freelancerCents,
        currency: payment.currency,
        destination: freelancer.stripeConnectedAccountId,
        source_transaction: intent.latest_charge as string,
        transfer_group: `ORDER_${orderId}`,
        metadata: { orderId },
      },
      { idempotencyKey: `release_${orderId}` } // a retry or double click cannot pay twice
    );

    return await this.orderRepository.updateOrder(orderId, {
      $set: {
        status: OrderStatus.COMPLETED,
        completedAt: new Date(),
        "paymentDetails.stripeTransferId": transfer.id,
        "paymentDetails.platformFee": feeCents / 100,
        "paymentDetails.freelancerAmount": freelancerCents / 100,
        "escrowDetails.escrowStatus": "RELEASED",
        "escrowDetails.releasedAt": new Date(),
        "escrowDetails.releaseReason": reason,
        ...extra,
      },
      $push: {
        statusHistory: { status: OrderStatus.COMPLETED, timestamp: new Date(), changedBy: by, reason },
      },
    });
  }

  async acceptOrders(orderId: string, clientId: string, feedback: string, rating: number): Promise<OrderType | null> {
    try {
      if (!Types.ObjectId.isValid(orderId)) throw new Error("Invalid order ID format");
      if (!Number.isInteger(rating) || rating < 1 || rating > 5) throw new Error("Rating must be between 1 and 5");

      const order = await this.orderRepository.findById(orderId);
      if (!order) throw new Error("Order not found");
      if (order.client.toString() !== clientId) throw new Error("This order does not belong to you");
      if (order.clientFeedback?.rating) throw new Error("You already reviewed this order");

      // 1. Money first. If this fails, nothing else changes.
      const updatedOrder = await this.releasePayment(orderId, "client", "Order completed & approved by client", {
        clientFeedback: { rating, feedback: feedback?.trim() ?? "", givenAt: new Date() },
      });

      // 2. Then the freelancer's rating
      const freelancer = await this.freelancerRepository.findById(order.freelancer.toString());
      const oldAverage = freelancer?.rating?.average ?? 0;
      const oldCount = freelancer?.rating?.count ?? 0;
      const newCount = oldCount + 1;
      await this.freelancerRepository.findByIdAndUpdate(order.freelancer.toString(), {
        rating: { average: (oldAverage * oldCount + rating) / newCount, count: newCount },
      });

      // 3. Notify the freelancer
      const gigData = await this.gigRepository.findById(order.gig.toString());
      const clientData = await this.userRepository.findById(order.client.toString());

      const earned = updatedOrder?.paymentDetails?.freelancerAmount ?? 0;
      const message = `Your order has been completed! You received $${earned.toFixed(2)}`;

      await this.notificationService.createNotification({
        orderId: new Types.ObjectId(orderId),
        clientName: clientData?.name || "Client",
        freelancer: order.freelancer,
        gigTitle: gigData?.title || "Gig",
        type: "order_completed" as const,
        message,
        plan: order.plan,
        isRead: false,
      });

      io.to(`user_${order.freelancer.toString()}`).emit("notification", {
        type: "order_completed",
        title: "Order Completed! 💰",
        message,
        orderId,
        timestamp: new Date(),
      });

      return updatedOrder;
    } catch (error) {
      console.error("Error in acceptOrders:", error);
      throw error;
    }
  }

  async requestRivision(orderId: string, clientId: string, revision: string): Promise<OrderType | null> {
    try {
      if (!Types.ObjectId.isValid(orderId)) throw new Error("Invalid order ID format");

      const order = await this.orderRepository.findById(orderId);
      if (!order) throw new Error("Order not found");
      if (order.client.toString() !== clientId) throw new Error("This order does not belong to you");
      if (order.status !== OrderStatus.DELIVERED) throw new Error("Revision can be requested only for delivered work");
      if (!revision?.trim()) throw new Error("Please explain what needs to change");
      if (order.revisionsRequested >= 2) throw new Error("Revision limit reached");

      const updatedOrder = await this.orderRepository.updateOrder(orderId, {
        $set: { status: OrderStatus.REVISION, revisionReason: revision.trim() },
        $inc: { revisionsRequested: 1 },
        $push: {
          statusHistory: {
            status: OrderStatus.REVISION,
            timestamp: new Date(),
            changedBy: "client",
            reason: revision.trim(),
          },
        },
      });

      // Tell the freelancer
      const gigData = await this.gigRepository.findById(order.gig.toString());
      const clientData = await this.userRepository.findById(order.client.toString());
      const message = `${clientData?.name || "The client"} requested a revision`;

      const notification = await this.notificationService.createNotification({
        freelancer: order.freelancer,
        orderId: new Types.ObjectId(orderId),
        type: "revision_requested" as const,
        message,
        gigTitle: gigData?.title || "Gig",
        clientName: clientData?.name || "Client",
        plan: order.plan,
        isRead: false,
      });

      io.to(`user_${order.freelancer.toString()}`).emit("notification", {
        _id: notification.id,
        type: "revision_requested",
        title: "Revision requested",
        message,
        orderId,
        gigTitle: gigData?.title,
        clientName: clientData?.name,
        timestamp: new Date(),
        isRead: false,
      });

      return updatedOrder;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
