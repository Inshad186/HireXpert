import User from "@/models/userBaseModel";
import { IUserRepository } from "../Interface/IUserRepository";
import { UserType } from "@/types/Type";
import { BaseRepository } from "../BaseRepository/implementation";
import { env } from "@/config/env.config";

export class UserRepository extends BaseRepository <UserType> implements IUserRepository {

  constructor(){
    super(User)
  }

  async findByEmail(email: string): Promise<UserType | null> {
    if(email === env.ADMIN_EMAIL) return null
    return await User.findOne({email})
  }

  
  async updateUserRole(email: string, role: string): Promise<void> {
    try {
      await User.updateOne({email}, {$set:{role}})
    } catch (err) {
      console.error(err)
    }
  }

  async findFreelancer(): Promise<Partial<UserType>[]> {
    const result = await User.find({ role: "freelancer", isBlocked: false }).select("name email profession work_experience working_days active_hours profilePicture")
    console.log("Result >>> : ",result);
    return result
    
  }
}
