import { CategoryType, OrderType, SkillType, UserType } from "@/types/Type";
import { IAdminService } from "../Interface/IAdminService";
import { generateHttpError } from "@/utils/http-error.util";
import { HttpStatus } from "@/constants/status.constant";
import { HttpResponse } from "@/constants/response.constant";
import { generateAccessToken, generateRefreshToken } from "@/utils/jwt.util";
import { ObjectId } from "mongoose";
import bcrypt from "bcrypt";
import { IAdminRepository } from "@/repositories/Interface/IAdminRepository";
import { env } from "@/config/env.config";

export class AdminService implements IAdminService {
  constructor(private adminRepository: IAdminRepository) {}

  async login( email: string, password: string ): Promise<{ accessToken: string; refreshToken: string; admin: UserType }> {
    if (!email || !password) {
      throw generateHttpError(HttpStatus.NOT_FOUND, HttpResponse.INVALID_EMAIL);
    }
    const admin = await this.adminRepository.findByEmail(email);

    if (!admin) {
      throw generateHttpError( HttpStatus.BAD_REQUEST, HttpResponse.INVALID_CREDENTIALS );
    }

    if (admin.email !== env.ADMIN_EMAIL || admin.role !== "admin") {
      throw generateHttpError( HttpStatus.UNAUTHORIZED, "Access denied. Not an admin.");
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password!);
    if (!isPasswordValid) {
      throw generateHttpError( HttpStatus.BAD_REQUEST, HttpResponse.INVALID_CREDENTIALS );
    }

    const accessToken = await generateAccessToken(
      admin._id as ObjectId,
      admin.role as string
    );
    const refreshToken = await generateRefreshToken(
      admin._id as ObjectId,
      admin.role as string
    );

    return { accessToken, refreshToken, admin };
  }

  async getDashboardStats(): Promise<{totalUsers: number; totalFreelancers: number; totalClients: number; totalGigs: number }> {
    try {
      const { totalUsers, totalFreelancers, totalClients, totalGigs } = await this.adminRepository.countTotalDashboardStats();
      return { totalUsers, totalFreelancers, totalClients, totalGigs };
    } catch (err) {
      console.error("Failed to get dashboard stats:", err);
      throw err;
    }
  }

  async getUsersList(page: number, limit: number, role: string, search: string, status: string): Promise<{ users: any[]; totalUsers: number }> {
    return await this.adminRepository.getAllUsers(page, limit, role, search, status);
  }


  async blockUser(userId: string): Promise<void> {
    const user = await this.adminRepository.findById(userId);

    if (!user) {
      throw generateHttpError( HttpStatus.BAD_REQUEST, HttpResponse.INVALID_CREDENTIALS);
    }
    user.isBlocked = !user.isBlocked;

    const saved = await this.adminRepository.save(user);

    if (!saved) {
      throw generateHttpError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        "Failed to update user"
      );
    }
  }

  async addCategories(name : string): Promise<CategoryType> {
    return await this.adminRepository.createCategory(name)
  }

  async getCategories(): Promise<any> {
    return await this.adminRepository.getAllCategories()
  }

  async addSkills(name: string, category: string): Promise<SkillType> {
    return await this.adminRepository.createSkill(name, category)
  }

  async getSkills(): Promise<{ [category: string]: { _id: string; name: string }[] }> {
    return await this.adminRepository.getAllSkills();
  }

  async editSkills(skillId: string, skillName: string): Promise<void> {
    await this.adminRepository.updateAllSkills(skillId, skillName);
  }

  async getOrdersList(): Promise<OrderType[]> {
    return await this.adminRepository.getAllOrders()
  }

  async deleteCategoryAndSkill(categoryId: string): Promise<void> {
    await this.adminRepository.deleteCategoryAndSkills(categoryId);
  }
}
