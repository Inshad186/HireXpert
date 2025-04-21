import User from "@/models/userModel";
import { IUserRepository } from "../Interface/IUserRepository";
import { UserType } from "@/models/userModel";

export class UserRepository implements IUserRepository {
  async createUser(user: Partial<UserType>): Promise<UserType> {
    return await User.create(user);
  }

  async findByEmail(email: string): Promise<UserType | null> {
    return await User.findOne({ email });
  }
}
