import { IAdminRepository } from "../Interface/IAdminRepository";
import { UserType } from "@/types/Type";
import User from "@/models/userModel";

export class AdminRepository implements IAdminRepository {
  async findByEmail(email: string): Promise<UserType | null> {
    try {
      const data = await User.findOne({ email });
      return data;
    } catch (error) {
      console.error(error);
      throw new Error("Error when finding the admin");
    }
  }

  async findById(userId: string): Promise<UserType | null> {
        try {
            const client = await User.findById(userId)
            return client
        } catch (error) {
            console.error(error);
            return null
        }
  }

  async countTotalUsers(): Promise<number> {
    try {
      return await User.countDocuments()
    } catch (error) {
      console.error(error);
      throw new Error("Error to getting the counts");
    }
  }

  async countTotalDashboardStats(): Promise<{totalUsers:number, totalFreelancers: number; totalClients: number;}> {
    try {
    const totalUsers = await User.countDocuments({role:{$ne:"admin"}});
    const totalFreelancers = await User.countDocuments({ role: "freelancer" });
    const totalClients = await User.countDocuments({ role: "client" });
    return {
    totalUsers,
    totalFreelancers,
    totalClients
  };
    } catch (error) {
      console.error(error);
      throw new Error("Error to getting the counts");
    }
  }

  async getAllUsers(): Promise<any[]> {
    try {
      const users = await User.find({ role: { $ne: "admin" } },{
      _id: 1,                      
      name: 1,
      email: 1,
      role: 1,
      isBlocked: 1,
      })
      return users
    } catch (error) {
      console.error(error);
      throw new Error("Error to getting the counts");
    }
  }

async save(user: UserType): Promise<boolean> {
  try {
    await User.findByIdAndUpdate(user._id, { isBlocked: user.isBlocked }); // ✅ actually update the data
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}


//   async verifyAdmin(Id: string): Promise<boolean> {
//     try {
//         const data = await User.findById(Id)
//         return data?.role == "admin"
//     } catch (err) {
//         console.error(err)
//         return false
//     }
//   }

}
