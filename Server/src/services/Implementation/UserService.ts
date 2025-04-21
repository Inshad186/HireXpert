import { IUserService } from "../Interface/IUserService"; 
import { IUserRepository } from "@/repositories/Interface/IUserRepository";
import bcrypt from "bcrypt"
import { UserType } from "@/models/userModel";

export class UserService implements IUserService {
  constructor(private userRepository: IUserRepository) {}

  async signup(userData: Partial<UserType>): Promise<UserType> {
    const existingUser = await this.userRepository.findByEmail(userData.email!);
    if (existingUser) throw new Error("User already exists");

    const hashedPassword = await bcrypt.hash(userData.password!, 10);
    const newUser = await this.userRepository.createUser({
      ...userData,
      password: hashedPassword,
    });

    return newUser;
  }
}
