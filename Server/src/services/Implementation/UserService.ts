import { IUserService } from "../Interface/IUserService"; 
import { IUserRepository } from "@/repositories/Interface/IUserRepository";
import bcrypt from "bcrypt"
import { UserType } from "@/models/userModel";
import { HttpResponse } from "@/constants/response.constant";


export class UserService implements IUserService {
  constructor(private userRepository: IUserRepository) {}

  async signup(userData: Partial<UserType>): Promise<UserType> {
    const existingUser = await this.userRepository.findByEmail(userData.email!);
    if (existingUser) throw new Error(HttpResponse.USER_EXIST)

    const hashedPassword = await bcrypt.hash(userData.password!, 10);
    const newUser = await this.userRepository.createUser({
      ...userData,
      password: hashedPassword,
    });
    return newUser;
  }
}
