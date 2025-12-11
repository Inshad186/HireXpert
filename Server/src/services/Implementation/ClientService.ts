import { ClientProfileType, GigType, OrderType } from "@/types/Type";
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
      console.log("Gig Details From client SErvices : ",gigDetails)
      if(!gigDetails){
        throw generateHttpError(HttpStatus.BAD_REQUEST, HttpResponse.INVALID_CREDENTIALS)
      }
      const freelancerId = gigDetails.freelancer?.toString()
      const freelancerDetails = await this.freelancerRepository.findById(freelancerId as string)

      if(!freelancerDetails){
        throw generateHttpError(HttpStatus.BAD_REQUEST, HttpResponse.USER_NOT_FOUND)
      }
      const userDetails = await this.userRepository.findById(freelancerId as string)
      return {
        gig : gigDetails,
        freelancer : freelancerDetails,
        profileImage : userDetails?.profilePicture as string
      }
    } catch (error) {
      console.error(error)
      throw error
    }
  }


  async createOrder(userId: string, freelancerId: string, gigId: string, requirements: string, selectedPlan: string): Promise<OrderType> {
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

      // Create order
      const details: Partial<OrderType> = {
        client: new Types.ObjectId(userId),
        freelancer: new Types.ObjectId(freelancerId),
        gig: new Types.ObjectId(gigId),
        requirements: requirements.trim(),
        plan: selectedPlan,
        status: "pending",
      };

      const order = await this.orderRepository.create(details);

      // Fetch gig and client details
      const gigData = await this.gigRepository.findById(gigId);
      const clientData = await this.userRepository.findById(userId);

      // Create notification using service
      const notificationData = {
        freelancer: new Types.ObjectId(freelancerId),
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

      console.log(`Notification sent to freelancer ${freelancerId}`);

      return order;
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  }

  async getMyOrders(userId: string): Promise<OrderType[]> {
    try {
      const OrderDetail = await this.clientRepository.findd(userId)
      console.log("ORDER DETAIL FROM CLIENT SERVICE : ",OrderDetail)
      return OrderDetail
    } catch (error) {
      console.error(error)
      throw error
    }
  }
}
