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


export class ClientService implements IClientService {
  constructor(
    private clientRepository: IClientRepository,
    private gigRepository: IGigRepository,
    private freelancerRepository: IFreelancerRepository,
    private userRepository: IUserRepository,
    private orderRepository: IOrderRepository
  ) {}

  async updateProfile( userId: string, userData: ClientProfileType ): Promise<ClientProfileType> {
    try {
      const user = await this.clientRepository.findById(userId)
      if (!user) {
        throw generateHttpError( HttpStatus.BAD_REQUEST, HttpResponse.USER_NOT_FOUND );
      }
      Object.assign(user, userData);
      await this.clientRepository.update(userId, user);
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


  async createOrder(userId: any, freelancerId: any, gigId: any, requirements: string, selectedPlan: string): Promise<OrderType> {
    try {
      const details: Partial<OrderType> = {
        client:userId,
        freelancer: freelancerId,
        gig: gigId,
        requirements,
        plan: selectedPlan

      }
      const order = await this.orderRepository.create(details)
      return order
    } catch (error) {
      console.error(error)
      throw error
    }
  }
}
