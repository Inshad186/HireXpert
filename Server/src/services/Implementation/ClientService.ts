import { ClientProfileType } from "@/types/Type";
import { IClientService } from "../Interface/IClientService";
import { IClientRepository } from "@/repositories/Interface/IClientRepository";
import { HttpStatus } from "@/constants/status.constant";
import { HttpResponse } from "@/constants/response.constant";
import { generateHttpError } from "@/utils/http-error.util";

export class ClientService implements IClientService {
  constructor(private clientRepository: IClientRepository) {}

  async updateProfile( userId: string, userData: ClientProfileType ): Promise<ClientProfileType> {
    try {
      const user = await this.clientRepository.findById(userId)
      if (!user) {
        throw generateHttpError( HttpStatus.BAD_REQUEST, HttpResponse.USER_NOT_FOUND );
      }
      // ✅ Mutate the existing Mongoose document directly
      Object.assign(user, userData);
      await this.clientRepository.update(userId, user);
      return user 
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
