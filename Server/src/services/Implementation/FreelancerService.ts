import { FileType, FreelancerProfileType, GigType, OrderType } from "@/types/Type";
import { IFreelancerService } from "../Interface/IFreelancerService";
import { IFreelancerRepository } from "@/repositories/Interface/IFreelancerRepository";
import { INotificationRepository } from "@/repositories/Interface/INotificationRepository";
import { HttpStatus } from "@/constants/status.constant";
import { HttpResponse } from "@/constants/response.constant";
import { generateHttpError } from "@/utils/http-error.util";
import { IGigRepository } from "@/repositories/Interface/IGigRepository";
import { handleProfileImageUpload } from "@/config/cloudinary.config";
import { mapper } from "@/config/mapper.config";
import { CreateGigDTO } from "@/dto/dto";
import { GigEntity } from "@/dto/entity";
import { IOrderRepository } from "@/repositories/Interface/IOrderRepository";
import { OrderStatus } from "@/models/orderModel";
import { IUserRepository } from "@/repositories/Interface/IUserRepository";
import { stripe } from "@/config/stripe.config";
import { env } from "@/config/env.config";
import { MAX_ACTIVE_GIGS } from "@/constants/gig.constants";
import { TEXT_LIMITS } from "@/constants/profile.constants";
import { isHttpUrl } from "@/utils/validation.util";
import { Types } from "mongoose";

const badRequest = (message: string) => generateHttpError(HttpStatus.BAD_REQUEST, message);
const MAX_LANGUAGES = 10;
const MAX_SKILLS = 15;

export class FreelancerService implements IFreelancerService {
  constructor(
    private freelanceRepository: IFreelancerRepository,
    private gigRepository: IGigRepository,
    private OrderRepository: IOrderRepository,
    private userRepository: IUserRepository,
    private notificationRepository: INotificationRepository
  ) {}

async updateProfile(userId: string, userData: unknown): Promise<{ userDetails: FreelancerProfileType }> {
  try {
    const profile = await this.freelanceRepository.findById(userId);
    if (!profile) throw generateHttpError(HttpStatus.BAD_REQUEST, HttpResponse.USER_NOT_FOUND);

    if (typeof userData !== "object" || userData === null || Array.isArray(userData)) {
      throw badRequest("Invalid profile data");
    }
    const input = userData as Record<string, unknown>;
    
    const updates: Record<string, unknown> = {};

    // 1. Text fields: must be text, trimmed, and not too long
    for (const [key, max] of Object.entries(TEXT_LIMITS)) {
      const value = input[key];
      if (value === undefined) continue;
      if (typeof value !== "string") throw badRequest(`${key} must be text`);

      const text = value.trim();
      if (text.length > max) throw badRequest(`${key} is too long`);
      updates[key] = text;
    }
    if ("name" in updates && !updates.name) throw badRequest("Name cannot be empty");
    if (updates.portfolio && !isHttpUrl(updates.portfolio as string)) {
      throw badRequest("Portfolio must start with http:// or https://");
    }

    // 2. Languages: a short list of texts, without duplicates
    if (input.proficient_languages !== undefined) {
      const list = input.proficient_languages;
      if (!Array.isArray(list) || list.some((item) => typeof item !== "string")) {
        throw badRequest("Languages must be a list of texts");
      }
      const languages = [...new Set(list.map((item: string) => item.trim()).filter(Boolean))];
      if (languages.length > MAX_LANGUAGES) throw badRequest(`You can add up to ${MAX_LANGUAGES} languages`);
      updates.proficient_languages = languages;
    }

    // 3. Skills: a short list of valid ids
    if (input.profileSkills !== undefined) {
      const list = input.profileSkills;
      if (!Array.isArray(list) || list.some((id) => typeof id !== "string" || !Types.ObjectId.isValid(id))) {
        throw badRequest("Invalid skills");
      }
      const skills = [...new Set(list as string[])];
      if (skills.length > MAX_SKILLS) throw badRequest(`You can select up to ${MAX_SKILLS} skills`);
      updates.profileSkills = skills;
    }

    // 4. Completeness: use the new value if it exists, otherwise the saved one
    const profession = (updates.profession ?? profile.profession) as string | undefined;
    const bio = (updates.bio ?? profile.bio) as string | undefined;
    const skills = (updates.profileSkills ?? profile.profileSkills) as unknown[] | undefined;
    const isProfileComplete = Boolean(profession && bio && skills?.length);

    const updated = await this.freelanceRepository.findByIdAndUpdate(userId, { ...updates, isProfileComplete });
    return { userDetails: (updated ?? profile) as FreelancerProfileType };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

  async createGig(gigData: any, gallery: FileType[]): Promise<string> {
    try {
      const freelancer = await this.freelanceRepository.findById(gigData.freelancer);
      
      if (!freelancer?.isProfileComplete) {
        throw generateHttpError(HttpStatus.BAD_REQUEST, "Please complete your profile first");
      }
      if (!gallery || gallery.length === 0) {
        throw generateHttpError(HttpStatus.BAD_REQUEST, "Service images are required");
      }

      const activeCount = await this.gigRepository.countActiveGigs(gigData.freelancer);
      if (activeCount >= MAX_ACTIVE_GIGS) {
        throw generateHttpError(HttpStatus.BAD_REQUEST,`You can have up to ${MAX_ACTIVE_GIGS} active gigs. Pause one to create a new gig.`);
      }

      const imageURLs = await Promise.all(
        gallery.map((file) => handleProfileImageUpload(file.buffer, "service_images"))
      );

      const dto = Object.assign(new CreateGigDTO(), {...gigData, gallery: imageURLs, });

      const mappedEntity = mapper.map(dto, CreateGigDTO, GigEntity);

      const createdGig = await this.gigRepository.create(mappedEntity);
      
      if (!createdGig?.id) {
        throw new Error("Failed to create gig");
      }

      return createdGig?.id;
    } catch (error) {
      console.error(error);
      throw error
    }
  }

  async getGigList(freelancerId: string): Promise<GigType[]> {
    try {
      const gigList = await this.gigRepository.findGigList(freelancerId)
      return gigList
    } catch (error) {
      console.error(error)
      throw new Error("Error Creating gigList")
    }
  }

  async updateGigStatus(id: string, freelancerId: string, isActive: boolean): Promise<void> {
    try {
      const gig = await this.gigRepository.findById(id);
      if (!gig) {
        throw generateHttpError(HttpStatus.BAD_REQUEST, "Gig not found");
      }
      if (gig.freelancer?.toString() !== freelancerId) {
        throw generateHttpError(HttpStatus.BAD_REQUEST, "This gig does not belong to you");
      }

      // Turning a paused gig on counts like creating a new active gig
      if (isActive && !gig.isActive) {
        const activeCount = await this.gigRepository.countActiveGigs(freelancerId);
        if (activeCount >= MAX_ACTIVE_GIGS) {
          throw generateHttpError(
            HttpStatus.BAD_REQUEST,
            `You can have up to ${MAX_ACTIVE_GIGS} active gigs. Pause one first.`
          );
        }
      }

      await this.gigRepository.findByIdAndUpdate(id, { isActive });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getFreelancerDashStats(freelancer: string): Promise<{ totalOrders: number; myGigs: number; activeOrders: number; }> {
    try {
      return await this.freelanceRepository.countFreelancerDashStats(freelancer)
    } catch (error) {
      throw error
    }
  }

  async getOrderList(freelancer: string): Promise<OrderType[]> {
    try {
      const orderList = await this.OrderRepository.findByFreelancer(freelancer)
      return orderList
    } catch (error) {
      console.error(error)
      throw new Error("Error fetching OrderList")
    }
  }

  async getOrders(orderId: string): Promise<OrderType | null> {
    try {
      const order = await this.OrderRepository.getOrders(orderId)
      return order
    } catch (error) {
      console.error(error)
      throw new Error("Error fetching in orders")
    }
  }

  async acceptOrder(orderId: string, freelancerId: string): Promise<OrderType | null> {
    try {
      const order = await this.OrderRepository.findById(orderId);

      if (!order) {
        throw generateHttpError(HttpStatus.BAD_REQUEST, "Order not found");
      }
      if (order.freelancer.toString() !== freelancerId) {
        throw generateHttpError(HttpStatus.BAD_REQUEST, "This order does not belong to you");
      }
      if (order.status !== OrderStatus.PENDING) {
        throw generateHttpError(HttpStatus.BAD_REQUEST, "This order cannot be accepted");
      }

      // The money can be released later only if a payout account exists
      const stripeStatus = await this.getStripeStatus(freelancerId);
      if (stripeStatus.status !== "connected") {
        throw generateHttpError(HttpStatus.BAD_REQUEST, "Please connect your payout account before accepting orders");
      }

      const updated = await this.OrderRepository.updateStatus(
        orderId,
        OrderStatus.PENDING,
        OrderStatus.ACCEPTED,
        "freelancer",
        { acceptedAt: new Date() }
      );
      if (!updated) {
        throw generateHttpError(HttpStatus.BAD_REQUEST, "This order was already updated");
      }
      await this.notificationRepository.markOrderNotificationsRead(orderId, freelancerId);
      return updated;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async rejectOrder(orderId: string, freelancerId: string, reason: string): Promise<void> {
    try {
      const order = await this.OrderRepository.findById(orderId);
      if (!order) throw generateHttpError(HttpStatus.BAD_REQUEST, "Order not found");
      if (order.freelancer.toString() !== freelancerId) {
        throw generateHttpError(HttpStatus.BAD_REQUEST, "This order does not belong to you");
      }
      if (order.status !== OrderStatus.PENDING) {
        throw generateHttpError(HttpStatus.BAD_REQUEST, "This order cannot be rejected");
      }
      if (!reason?.trim()) {
        throw generateHttpError(HttpStatus.BAD_REQUEST, "Please give a reason");
      }

      // Refund first. If this fails, the order stays PENDING and nothing is lost.
      const paymentIntentId = order.paymentDetails?.stripePaymentIntentId;
      if (!paymentIntentId) throw generateHttpError(HttpStatus.BAD_REQUEST, "No payment found for this order");

      await stripe.refunds.create(
        { payment_intent: paymentIntentId },
        { idempotencyKey: `refund_${orderId}` } // a retry cannot refund twice
      );

      await this.OrderRepository.updateOrder(orderId, {
        $set: {
          status: OrderStatus.REJECTED,
          cancellationReason: reason.trim(),
          cancelledAt: new Date(),
          cancelledBy: "freelancer",
          "escrowDetails.escrowStatus": "REFUNDED",
          "escrowDetails.releasedAt": new Date(),
          "escrowDetails.releaseReason": "Rejected by freelancer",
        },
        $push: {
          statusHistory: { status: OrderStatus.REJECTED, timestamp: new Date(), changedBy: "freelancer", reason: reason.trim() },
        },
      });
      await this.notificationRepository.markOrderNotificationsRead(orderId, freelancerId);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async inprogressOrder(orderId: string, freelancerId: string): Promise<OrderType | null> {
    try {
      const order = await this.OrderRepository.findById(orderId);
      if (!order) throw generateHttpError(HttpStatus.BAD_REQUEST, "Order not found");
      if (order.freelancer.toString() !== freelancerId) {
        throw generateHttpError(HttpStatus.BAD_REQUEST, "This order does not belong to you");
      }
      if (order.status !== OrderStatus.ACCEPTED) {
        throw generateHttpError(HttpStatus.BAD_REQUEST, "This order cannot be started");
      }

      const updated = await this.OrderRepository.updateOrder(orderId, {
        $set: { status: OrderStatus.IN_PROGRESS, startedAt: new Date() },
        $push: {
          statusHistory: { status: OrderStatus.IN_PROGRESS, timestamp: new Date(), changedBy: "freelancer" },
        },
      });
      await this.notificationRepository.markOrderNotificationsRead(orderId, freelancerId);
      return updated;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async deliveryOrder( orderId: string, freelancerId: string, deliveryFiles: FileType[], deliveryNotes: string ): Promise<OrderType | null> {
    try {
      const order = await this.OrderRepository.findById(orderId);
      if (!order) {
        throw generateHttpError(HttpStatus.BAD_REQUEST, "Order not found");
      }
      if (order.freelancer.toString() !== freelancerId) {
        throw generateHttpError(HttpStatus.BAD_REQUEST, "This order does not belong to you");
      }
      if (order.status !== "IN_PROGRESS" && order.status !== "REVISION") {
        throw generateHttpError(HttpStatus.BAD_REQUEST, "This order is not ready for delivery");
      }
      if (!deliveryFiles || deliveryFiles.length === 0) {
        throw generateHttpError(HttpStatus.BAD_REQUEST, "Please upload at least one file");
      }
      if (!deliveryNotes?.trim()) {
        throw generateHttpError(HttpStatus.BAD_REQUEST, "Please add delivery notes");
      }

      const deliveryFileURLs = await Promise.all(
        deliveryFiles.map((file) => handleProfileImageUpload(file.buffer, "delivery_files"))
      );

      // The client now has 5 days to review. After that, the money is released automatically.
      const holdUntilDate = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000);

      const updatedOrder = await this.OrderRepository.updateOrder(orderId, {
        $set: {
          status: "DELIVERED",
          deliveryFiles: deliveryFileURLs,
          deliveryNotes: deliveryNotes.trim(),
          deliveredAt: new Date(),
          "escrowDetails.holdUntilDate": holdUntilDate,
        },
        $push: {
          statusHistory: {
            status: "DELIVERED",
            timestamp: new Date(),
            changedBy: "freelancer",
            reason: "Delivery submitted",
          },
        },
      });

      // Step 2: clear the freelancer's old notifications for this order
      await this.notificationRepository.markOrderNotificationsRead(orderId, freelancerId);

      await this.notificationRepository.create({
      client: order.client,
      orderId: order._id,
      gigTitle: updatedOrder?.gig?.title,
      type: "work_delivered",
      message: "Your work has been delivered. Please review it.",
      isRead: false,
    });

      return updatedOrder;
    } catch (error) {
      console.error(error);
      throw error; // keep the original message and status
    }
  }

  async startStripeOnboarding(freelancerId: string): Promise<{ onboardingUrl: string; accountId: string; }> {
    try {
      const user = await this.userRepository.findById(freelancerId)

      if(!user?.email) throw new Error("Email not found")
      
      const account = await stripe.accounts.create({
        type: "express",
        country: "US",
        email: user.email
      })

      const savedFreelancer = await this.freelanceRepository.findByIdAndUpdate(freelancerId,{
        stripeConnectedAccountId: account.id,
        stripeOnboardingComplete: false
      })

      if (!savedFreelancer?.stripeConnectedAccountId) {
        throw new Error("Failed to save Stripe account ID to database");
      }

      console.log(`✅ Account ID saved to database: ${savedFreelancer.stripeConnectedAccountId}`);

      const link = await stripe.accountLinks.create({
        account: account.id,
        type: "account_onboarding",
        refresh_url: `${env.CLIENT_URL}/freelancer-dashboard`,
        return_url: `${env.CLIENT_URL}/freelancer-dashboard`
      })
      return {
        onboardingUrl: link.url,
        accountId: account.id
      }
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  async getStripeStatus(freelancerId: string): Promise<{ status: string; message: string }> {
    try {
      const freelancer = await this.freelanceRepository.findById(freelancerId);
      if (!freelancer?.stripeConnectedAccountId) {
        return { status: "not_connected", message: "Not connected" };
      }
      const account = await stripe.accounts.retrieve(freelancer.stripeConnectedAccountId );
      if (account.charges_enabled && account.payouts_enabled) {
        return { status: "connected", message: "Connected" };
      }
      return { status: "pending", message: "Pending verification" };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getEarnings(freelancerId: string) {
    const [summary, recent] = await Promise.all([
      this.freelanceRepository.getEarnings(freelancerId),
      this.freelanceRepository.getRecentEarnings(freelancerId),
    ]);
    return { ...summary, recent };
  }

}