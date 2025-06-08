import { UserType } from "@/types/Type";
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
    constructor(private adminRepository : IAdminRepository){}

async login(email: string, password: string): Promise<{ accessToken: string; refreshToken: string; admin: UserType; }> {
  if (!email || !password) {
    throw generateHttpError(HttpStatus.NOT_FOUND, HttpResponse.INVALID_EMAIL);
  }

  const admin = await this.adminRepository.findByEmail(email);

  if (!admin) {
    throw generateHttpError(HttpStatus.BAD_REQUEST, HttpResponse.INVALID_CREDENTIALS);
  }

  if (
    admin.email !== env.ADMIN_EMAIL ||
    admin.role !== 'admin'
  ) {
    throw generateHttpError(HttpStatus.UNAUTHORIZED, "Access denied. Not an admin.");
  }

  const isPasswordValid = await bcrypt.compare(password, admin.password!);
  if (!isPasswordValid) {
    throw generateHttpError(HttpStatus.BAD_REQUEST, HttpResponse.INVALID_CREDENTIALS);
  }

  const accessToken = await generateAccessToken(admin._id as ObjectId, admin.role as string);
  const refreshToken = await generateRefreshToken(admin._id as ObjectId, admin.role as string);

  return { accessToken, refreshToken, admin };
}


    async getDashboardStats(): Promise<{ totalUsers: number; totalFreelancers: number; totalClients: number; }> {
      try {
        const { totalUsers, totalFreelancers, totalClients } = await this.adminRepository.countTotalDashboardStats();
        return { totalUsers, totalFreelancers, totalClients };
      } catch (err) {
        console.error("Failed to get dashboard stats:", err);
        throw err;
      }
    }

    async getUsersList(): Promise<any[]> {
      return await this.adminRepository.getAllUsers();
    }

async blockUser(userId: string): Promise<void> {
  const user = await this.adminRepository.findById(userId);

  if (!user) {
    throw generateHttpError(HttpStatus.BAD_REQUEST, HttpResponse.INVALID_CREDENTIALS);
  }

  user.isBlocked = !user.isBlocked;

  const saved = await this.adminRepository.save(user);

  if (!saved) {
    throw generateHttpError(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to update user");
  }
}

}
