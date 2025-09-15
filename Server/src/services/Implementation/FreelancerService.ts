import { FileType, FreelancerProfileType, GigType } from "@/types/Type";
import { IFreelancerService } from "../Interface/IFreelancerService";
import { IFreelancerRepository } from "@/repositories/Interface/IFreelancerRepository";
import { HttpStatus } from "@/constants/status.constant";
import { HttpResponse } from "@/constants/response.constant";
import { generateHttpError } from "@/utils/http-error.util";
import { IGigRepository } from "@/repositories/Interface/IGigRepository";
import { handleProfileImageUpload } from "@/config/cloudinary.config";

export class FreelancerService implements IFreelancerService {
  constructor(
    private freelanceRepository: IFreelancerRepository,
    private gigRepository: IGigRepository
  ) {}

  async updateProfile( userId: string, userData: FreelancerProfileType ): Promise<{ userDetails: FreelancerProfileType }> {
    try {
      const user = await this.freelanceRepository.findById(userId)
      if (!user) {
        throw generateHttpError( HttpStatus.BAD_REQUEST, HttpResponse.USER_NOT_FOUND );
      }
      Object.assign(user, userData);
      await this.freelanceRepository.update(userId, user);
      return { userDetails: user };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

async createGig(gig: GigType, gallery: FileType[]): Promise<string> {
  try {
    if (!gallery || gallery.length === 0) {
      throw generateHttpError(HttpStatus.BAD_REQUEST, "Service images are required");
    }
    const imageURLs = await Promise.all(
      gallery.map((file) => handleProfileImageUpload(file.buffer, "service_images"))
    );
    const createdGig = await this.gigRepository.create({ ...gig, gallery: imageURLs });
    return createdGig?.id;
  } catch (error) {
    console.error(error);
    throw new Error("Error Creating gig");
  }
}

  async getGigList(freelancerId: string): Promise<GigType[]> {
    try {
      return await this.gigRepository.findGigList(freelancerId)
    } catch (error) {
      console.error(error)
      throw new Error("Error Creating gigList")
    }
  }

  async updateGigStatus(id: string, currentStatus: boolean): Promise<void> {
    try {
      await this.gigRepository.update(id, {isActive: currentStatus})
    } catch (error) {
      console.error(error)
      throw new Error("Error Creating gigList")
    }
  }

}
