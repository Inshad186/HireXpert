import User from "@/models/userModel";
import { IUserRepository } from "../Interface/IUserRepository";
import { UserType } from "@/types/Type";
import { BaseRepository } from "../BaseRepository/implementation";

export class UserRepository extends BaseRepository <UserType> implements IUserRepository {

  constructor(){
    super(User)
  }

  async createUser(user: UserType): Promise<UserType> {
    console.log("verify OTP ? > ?")
    const userData = await User.create(user)
    console.log("User Repository User DAta",userData)
    return userData
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

  async updateUser(user: UserType): Promise<void> {
    try {
      await User.findByIdAndUpdate(user._id, user)
    } catch (error) {
      console.error(error);
      throw new Error("Error when updating the user");
    }
  }

  async findFreelancer(): Promise<Partial<UserType>[]> {
    const result = await User.find({ role: "freelancer" }).select("name email")
    console.log("Result >>> : ",result);
    return result
    
  }
}
