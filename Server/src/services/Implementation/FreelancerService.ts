import { FileType, FreelancerProfileType, GigType } from "@/types/Type";
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

async createGig(gigData: any, gallery: FileType[]): Promise<string> {
  try {
    if (!gallery || gallery.length === 0) {
      throw generateHttpError(HttpStatus.BAD_REQUEST, "Service images are required");
    }

    const imageURLs = await Promise.all(
      gallery.map((file) => handleProfileImageUpload(file.buffer, "service_images"))
    );

    // 1️⃣ Create DTO instance
    const dto = Object.assign(new CreateGigDTO(), {...gigData, gallery: imageURLs, });
    console.log("DTO : ",dto)

    // 2️⃣ Map DTO → Entity
    const mappedEntity = mapper.map(dto, CreateGigDTO, GigEntity);
    console.log("Mapped Entity : ",mappedEntity)

    // 3️⃣ Save Entity
    const createdGig = await this.gigRepository.create(mappedEntity);
    return createdGig?.id;
  } catch (error) {
    console.error(error);
    throw new Error("Error Creating gig");
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
      await this.gigRepository.update(id, {isActive: currentStatus})
    } catch (error) {
      console.error(error)
      throw new Error("Error Creating gigList")
    }
  }

}
