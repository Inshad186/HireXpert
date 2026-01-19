import { FileType, FreelancerProfileType, GigType, OrderType } from "@/types/Type";
import { IFreelancerService } from "../Interface/IFreelancerService";
import { IFreelancerRepository } from "@/repositories/Interface/IFreelancerRepository";
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

export class FreelancerService implements IFreelancerService {
  constructor(
    private freelanceRepository: IFreelancerRepository,
    private gigRepository: IGigRepository,
    private OrderRepository: IOrderRepository,
    private userRepository: IUserRepository
  ) {}

  async updateProfile( userId: string, userData: FreelancerProfileType ): Promise<{ userDetails: FreelancerProfileType }> {
    try {
      const user = await this.freelanceRepository.findById(userId)
      if (!user) {
        throw generateHttpError( HttpStatus.BAD_REQUEST, HttpResponse.USER_NOT_FOUND );
      }
      Object.assign(user, userData);
      await this.freelanceRepository.findByIdAndUpdate(userId, user);
      return { userDetails: user };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

async createGig(gigData: any, gallery: FileType[]): Promise<string> {
  try {
    if (!gallery || gallery.length === 0) {
      throw generateHttpError(HttpStatus.BAD_REQUEST, "Service images are required");
    }

    const imageURLs = await Promise.all(
      gallery.map((file) => handleProfileImageUpload(file.buffer, "service_images"))
    );

    const dto = Object.assign(new CreateGigDTO(), {...gigData, gallery: imageURLs, });
    console.log("DTO : ",dto)

    const mappedEntity = mapper.map(dto, CreateGigDTO, GigEntity);
    console.log("Mapped Entity : ",mappedEntity)

    const createdGig = await this.gigRepository.create(mappedEntity);
    
    if (!createdGig?.id) {
      throw new Error("Failed to create gig");
    }
    await this.freelanceRepository.findByIdAndUpdate( gigData.freelancer, {isSeller: true})

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

  async updateGigStatus(id: string, currentStatus: boolean): Promise<void> {
    try {
      await this.gigRepository.findByIdAndUpdate(id, {isActive: currentStatus})
    } catch (error) {
      console.error(error)
      throw new Error("Error Creating gigList")
    }
  }

  async getFreelancerDashStats(freelancer: string): Promise<{ totalOrders: number; myGigs: number; activeOrders: number; }> {
    try {
      const {totalOrders, myGigs, activeOrders } = await this.freelanceRepository.countFreelancerDashStats(freelancer)
      return {totalOrders, myGigs, activeOrders}
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

  async acceptOrder(id: string): Promise<OrderType | null> {
    try {
      const order = await this.OrderRepository.findById(id)
      if(!order){
        throw new Error("Failed to get order")
      }
      if(order.status !== OrderStatus.PENDING){
        throw new Error("Failed")
      }
      return await this.OrderRepository.findByIdAndUpdate(id, {status: OrderStatus.ACCEPTED })
    } catch (error) {
      console.error(error)
      throw new Error("Error in accept Order")
    }
  }

  async rejectOrder(orderId: string, reason: string): Promise<void> {
    try {
      await this.OrderRepository.findByIdAndUpdate(orderId,{cancellationReason: reason})
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  async inprogressOrder(orderId: string): Promise<OrderType | null> {
    try {
      const order = await this.OrderRepository.findById(orderId)
      if(!order){
        throw new Error("Failed to get Order")
      }
      if(order.status !== OrderStatus.ACCEPTED){
        throw new Error("Failed")
      }
      return await this.OrderRepository.findByIdAndUpdate(orderId, {status: OrderStatus.IN_PROGRESS})
    } catch (error) {
      console.error(error)
      throw new Error("Error in inProgress Order")
    }
  }

  async deliveryOrder(orderId: string, freelancerId : string, deliveryFiles: FileType[], deliveryNotes: string): Promise<OrderType[]> {
    try {
      const order = await this.OrderRepository.findById(orderId)
      if(!order){
        throw new Error("Failed to get Order")
      }
      if(order.freelancer.toString() !== freelancerId){
        throw new Error("Failed")
      }
      if(order.status !== "IN_PROGRESS"){
        throw new Error("Failed")
      }

      let deliveryFileURLs: string[] = []
      if(deliveryFiles && deliveryFiles.length > 0){
        deliveryFileURLs = await Promise.all(
          deliveryFiles.map((file) => handleProfileImageUpload(file.buffer, "delivery_files"))
        )
      }
      const updatedOrder = await this.OrderRepository.updateOrder(orderId, {
        status: "DELIVERED",
        deliveryFiles: deliveryFileURLs,
        deliveryNotes: deliveryNotes,
        deliveredAt: new Date(),
        $push: {
          statusHistory: {
            status: "DELIVERED",
            timestamp: new Date(),
            changedBy: "freelancer",
            reason: "Delivery submitted",
          },
        },
      });
      return updatedOrder
    } catch (error) {
      console.error(error)
      throw new Error("Error in inProgress Order")
    }
  }

  async startStripeOnboarding(freelancerId: string): Promise<{ onboardingUrl: string; accountId: string; }> {
    try {
      console.log("💳💳💳")
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
      const account = await stripe.accounts.retrieve(
        freelancer.stripeConnectedAccountId
      );
      if (account.charges_enabled && account.payouts_enabled) {
        return { status: "connected", message: "Connected" };
      }
      return { status: "pending", message: "Pending verification" };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

}