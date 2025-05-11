import User from "@/models/userModel";
import { IUserRepository } from "../Interface/IUserRepository";
import { UserType } from "@/types/Type";

export class UserRepository implements IUserRepository {
  async createUser(user: Partial<UserType>): Promise<UserType> {
    return await User.create(user);
  }

  async findByEmail(email: string): Promise<UserType | null> {
    return await User.findOne({ email });
  }

  async updateUserRole(email: string, role: string): Promise<void> {
    try {
      await User.updateOne({email}, {$set:{role}})
    } catch (err) {
      console.error(err)
    }
  }
}
