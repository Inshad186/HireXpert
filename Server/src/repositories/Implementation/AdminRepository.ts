import { IAdminRepository } from "../Interface/IAdminRepository";
import Skill from "@/models/skillModel"
import { UserType } from "@/types/Type";
import User from "@/models/userBaseModel";
import Freelancer from "@/models/freelancerModel";
import { BaseRepository } from "../BaseRepository/implementation";
import { SkillType } from "@/types/Type";
import Category from "@/models/categoryModel"
import { CategoryType } from "@/types/Type";

export class AdminRepository extends BaseRepository<SkillType> implements IAdminRepository {
  constructor(){
    super(Skill)
  }
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
      const client = await User.findById(userId);
      return client;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async countTotalUsers(): Promise<number> {
    try {
      return await User.countDocuments();
    } catch (error) {
      console.error(error);
      throw new Error("Error to getting the counts");
    }
  }

  async countTotalDashboardStats(): Promise<{
    totalUsers: number;
    totalFreelancers: number;
    totalClients: number;
  }> {
    try {
      const totalUsers = await User.countDocuments({ role: { $ne: "admin" } });
      const totalFreelancers = await User.countDocuments({
        role: "freelancer",
      });
      const totalClients = await User.countDocuments({ role: "client" });
      return {
        totalUsers,
        totalFreelancers,
        totalClients,
      };
    } catch (error) {
      console.error(error);
      throw new Error("Error to getting the counts");
    }
  }

  async getAllUsers(): Promise<any[]> {
    try {
      const users = await User.find({ role: { $ne: "admin" } });
      return users;
    } catch (error) {
      console.error(error);
      throw new Error("Error to getting the counts");
    }
  }

  async save(user: UserType): Promise<boolean> {
    try {
      await User.findByIdAndUpdate(user._id, { isBlocked: user.isBlocked }); 
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }


  async getAllSkills(): Promise<{ [category: string]: { _id: string; name: string }[] }> {
    try {
      const skills = await Skill.find({}).populate("category", "name")
      const groupedSkills = skills.reduce((acc: { [key: string]: { _id: string; name: string }[] }, skill) => {
        const categoryName = (skill.category as any)?.name || "Uncategorized";
        if (!acc[categoryName]) acc[categoryName] = [];
        acc[categoryName].push({ _id: skill._id.toString(), name: skill.name });
        return acc;
      }, {});
        return groupedSkills;
      } catch (error) {
        console.error(error);
        throw new Error("Error fetching skills");
      }
    }

    async createCategory(name : string) : Promise<CategoryType> {
      const existing = await Category.findOne({ name })
      if(existing) {
        throw new Error("Category already exists");
      }
      const category = new Category({ name })
      return await category.save()
    }

  async getAllCategories(): Promise<CategoryType[]> {
    return await Category.find({});
  }

  async createSkill(name: string, category: string): Promise<SkillType> {
    const existing = await Skill.findOne({name, category})
    if(existing){
      throw new Error("Skill already exists")
    }
    const skill = new Skill({ name, category })
    return await skill.save()
  }


  async updateAllSkills(skillId: string, skillName: string): Promise<void> {
    try {
      // Just update the Skill document
      await Skill.findByIdAndUpdate(skillId, { name: skillName });
    } catch (error) {
      throw new Error("Failed to update skill");
    }
  }


  async deleteCategoryAndSkills(categoryId: string): Promise<void> {
    await Skill.deleteMany({ category: categoryId });
    await Category.findByIdAndDelete(categoryId);
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
