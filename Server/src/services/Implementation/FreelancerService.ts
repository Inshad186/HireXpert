import { FreelancerProfileType } from "@/types/Type";
import { IFreelancerService } from "../Interface/IFreelancerService";
import { IFreelancerRepository } from "@/repositories/Interface/IFreelancerRepository";
import { HttpStatus } from "@/constants/status.constant";
import { HttpResponse } from "@/constants/response.constant";
import { generateHttpError } from "@/utils/http-error.util";

export class FreelancerService implements IFreelancerService {
  constructor(private clientRepository: IFreelancerRepository) {}

  async updateProfile( userId: string, userData: FreelancerProfileType ): Promise<{ userDetails: FreelancerProfileType }> {
    try {
      const user = await this.clientRepository.findById(userId)
      if (!user) {
        throw generateHttpError( HttpStatus.BAD_REQUEST, HttpResponse.USER_NOT_FOUND );
      }
      Object.assign(user, userData);
      await this.clientRepository.updateUser(userId, user);
      return { userDetails: user };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
