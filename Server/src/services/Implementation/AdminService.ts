import { UserType } from "@/types/Type";
import { IAdminService } from "../Interface/IAdminService";
import { generateHttpError } from "@/utils/http-error.util";
import { HttpStatus } from "@/constants/status.constant";
import { HttpResponse } from "@/constants/response.constant";
import { generateAccessToken, generateRefreshToken } from "@/utils/jwt.util";
import { ObjectId } from "mongoose";
import bcrypt from "bcrypt";
import { IAdminRepository } from "@/repositories/Interface/IAdminRepository";

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
    
        const isPasswordValid = await bcrypt.compare(password, admin.password!);
        if (!isPasswordValid) {
            throw generateHttpError(HttpStatus.BAD_REQUEST, HttpResponse.INVALID_CREDENTIALS);
        }
    
        const accessToken = await generateAccessToken(admin?._id as ObjectId, admin.role as string);
        const refreshToken = await generateRefreshToken(admin?._id as ObjectId, admin.role as string);
    
        return { accessToken, refreshToken, admin };
    }
}
