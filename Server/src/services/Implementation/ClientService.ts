import { ClientProfileType, GigType, OrderStatus, OrderType } from "@/types/Type";
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

  async getGigs(): Promise<GigType[]> {
    try {
      return await this.gigRepository.findGigs()
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
      console.log("Freelancer REviewsss  :",freelancerReviews)
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

  async createPaymentIntent(userId: string, freelancerId: string, gigId: string, price: number ): Promise<{clientSecret: string, paymentIntentId: string}> {
    try {
      if (
        !Types.ObjectId.isValid(userId) ||
        !Types.ObjectId.isValid(freelancerId) ||
        !Types.ObjectId.isValid(gigId)
      ) {
          throw new Error("Invalid ID format")
        }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(price * 100),
        currency: "usd",
        payment_method_types: ["card"],
        metadata: {
          gigId,
          freelancerId,
          clientId: userId
        },
        capture_method: "automatic"
      })
      return {
        clientSecret: paymentIntent.client_secret as string,
        paymentIntentId: paymentIntent.id
      }
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  async createOrder(userId: string, freelancerId: string, gigId: string, requirements: string, selectedPlan: string, paymentIntentId: string, price: number): Promise<OrderType> {
    try {
      if (
        !Types.ObjectId.isValid(userId) ||
        !Types.ObjectId.isValid(freelancerId) ||
        !Types.ObjectId.isValid(gigId)
      ) {
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

      if(paymentIntent.amount !== Math.round(price * 100)){
        throw new Error("Payment amount mismatch")
      }

      // Create order
      const details: Partial<OrderType> = {
        client: new Types.ObjectId(userId),
        freelancer: new Types.ObjectId(freelancerId),
        gig: new Types.ObjectId(gigId),
        requirements: requirements.trim(),
        plan: selectedPlan,
        status: OrderStatus.PENDING,
        paymentDetails:{
          stripePaymentIntentId: paymentIntentId,
          amount: price,
          currency: "usd",
          status: "SUCCEEDED",
          paidAt: new Date()
        },
        escrowDetails: {
          holdUntilDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),  
          escrowStatus: "HELD"
        }
        
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

  async acceptOrders(orderId: string, feedback: string, rating: number): Promise<OrderType | null> {
    try {
      if (!Types.ObjectId.isValid(orderId)) {
        throw new Error("Invalid order ID format");
      }
      if (rating < 1 || rating > 5) {
        throw new Error("Rating must be between 1 & 5");
      }
      const order = await this.orderRepository.findById(orderId);
      if (!order) {
        throw new Error("Order not found");
      }
      if (order.status !== "DELIVERED") {
        throw new Error("Order must be DELIVERED");
      }
      if(!order.paymentDetails?.stripePaymentIntentId){
        throw new Error
      }
      const gigData = await this.gigRepository.findById(order.gig.toString())
      const clientData = await this.userRepository.findById(order.client.toString())

      const paymentIntent = await stripe.paymentIntents.retrieve(
        order.paymentDetails?.stripePaymentIntentId 
      );

    console.log(`Payment status: ${paymentIntent.status}`);

    // If payment is already succeeded, skip capture
    // (it was auto-captured when user paid)
    if (paymentIntent.status !== "succeeded") {
      console.log("Payment not yet succeeded, attempting to capture...");
      
      try {
        const capturedIntent = await stripe.paymentIntents.capture(
          order.paymentDetails.stripePaymentIntentId
        );
        console.log(`✅ Payment captured: ${orderId}`);
      } catch (captureError: any) {
        if (captureError.code === "payment_intent_unexpected_state") {
          // Payment already captured, continue
          console.log("Payment already captured, continuing...");
        } else {
          throw captureError;
        }
      }
    } else {
      console.log("✅ Payment already succeeded, skipping capture");
    }

    // Calculate amounts
    const totalAmount = order.paymentDetails.amount;
    const platformFee = (totalAmount as number) * 0.2;
    const freelancerAmount = (totalAmount as number) - platformFee;

    console.log(`Order ${orderId}: Total: ₹${totalAmount}, Fee: ₹${platformFee}, Freelancer: ₹${freelancerAmount}`);

    // Get freelancer and check Stripe account
    const freelancer = await this.freelancerRepository.findById(order.freelancer.toString());

    if (!freelancer) {
      throw new Error("Freelancer not found");
    }

    if(order.clientFeedback?.rating){
      throw new Error("Client already reviewed this order")
    }

    const oldAverage = freelancer?.rating.average || 0
    const oldCount = freelancer?.rating.count || 0

    const newCount = oldCount + 1
    const newAverage = ((oldAverage * oldCount) + rating) / newCount;

    await this.freelancerRepository.findByIdAndUpdate(order.freelancer.toString(), {
      rating: {
        average: newAverage,
        count: newCount
      }
    })

    if (!freelancer.stripeConnectedAccountId) {
      throw new Error("Freelancer has not connected Stripe account");
    }

    // Verify account is ready
    const account = await stripe.accounts.retrieve(freelancer.stripeConnectedAccountId);

    if (!account.charges_enabled || !account.payouts_enabled) {
      throw new Error("Freelancer's Stripe account not ready");
    }

    // Transfer funds to freelancer
    const transfer = await stripe.transfers.create({
      amount: Math.round(freelancerAmount * 100),
      currency: "usd",
      destination: freelancer.stripeConnectedAccountId,
      metadata: { orderId }
    });

    console.log(`💰 Transferred ₹${freelancerAmount} to freelancer: ${transfer.id}`);

      // Step 6: Update order
      const updatedOrder = await this.orderRepository.findByIdAndUpdate(orderId,{
        status: OrderStatus.COMPLETED,
        completedAt: new Date(),
        clientFeedback : {
          rating: rating,
          feedback:feedback,
          givenAt: new Date()
        },
        paymentDetails: {
          status: "SUCCEEDED",
          stripeTransferId: transfer.id
        },
        escrowDetails: {
          escrowStatus: "RELEASED",
          releasedAt: new Date(),
          releaseReason: "Order Completed & approved by client"
        },
        statusHistory: [
          {
            status: OrderStatus.COMPLETED,
            changedBy: "client",
            timestamp: new Date()
          }
        ]
      })

      // Step 7: Notify freelancer
    const notificationData = {
      orderId: new Types.ObjectId(orderId),
      clientName: clientData?.name || "Client",
      freelancer: order.freelancer,
      gigTitle: gigData?.title || "Gig",
      type: "order_completed" as const,
      message: `Your order has been completed! You received ₹${freelancerAmount.toFixed(2)}`,
      plan: order.plan,
      isRead: false
    };

    await this.notificationService.createNotification(notificationData);

    // Socket notification
    io.to(`user_${order.freelancer.toString()}`).emit("notification", {
      type: "order_completed",
      title: "Order Completed! 💰",
      message: `You received ₹${freelancerAmount.toFixed(2)} for order from ${clientData?.name || "Client"}`,
      orderId,
      timestamp: new Date()
    });

    return updatedOrder;
  } catch (error) {
    console.error("Error in acceptOrders:", error);
    throw error;
  }
}

  async requestRivision(orderId: string, revision: string, revisionCount: number): Promise<OrderType | null> {
    try {
      const order = await this.orderRepository.findById(orderId)
      if(!order){
        throw new Error("Failed to get Order")
      }
      if(order.status !== "DELIVERED"){
        throw new Error("Failed")
      }
      return await this.orderRepository.findByIdAndUpdate(orderId,{
        revisionReason:revision,
        revisionsRequested: revisionCount
      })
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  
}
