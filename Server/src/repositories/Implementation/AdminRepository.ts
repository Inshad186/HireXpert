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
