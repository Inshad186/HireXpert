import { Request, Response, NextFunction } from "express";
import { IAdminController } from "../Interface/IAdminController";
import { IAdminService } from "@/services/Interface/IAdminService";
import { HttpStatus } from "@/constants/status.constant";
import { HttpResponse } from "@/constants/response.constant";

export class AdminController implements IAdminController {
  constructor(private adminService: IAdminService) {}

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;
      const { accessToken, refreshToken, admin } =
        await this.adminService.login(email, password);
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      res.status(HttpStatus.OK).json({ message: HttpResponse.LOGIN_SUCCESS, accessToken, admin });
    } catch (error) {
      next(error);
    }
  }

  async getDashboardStats( req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { totalUsers, totalFreelancers, totalClients, totalGigs } = await this.adminService.getDashboardStats();
      res.status(HttpStatus.OK).json({ success: true, totalUsers, totalFreelancers, totalClients, totalGigs });
    } catch (error) {
      next();
    }
  }

  async getUsersList( req: Request, res: Response, next: NextFunction ): Promise<void> {
    try {
      const page = parseInt(req.query.page as string)
      const limit = parseInt(req.query.limit as string)
      const role = req.query.role as string
      const search = req.query.search as string
      const status = req.query.status as string
      const { users, totalUsers } = await this.adminService.getUsersList(page, limit, role, search, status);
      const totalPages = Math.ceil(totalUsers / limit);
      res.status(HttpStatus.OK).json({ success: true, users, totalUsers, totalPages, currentPage: page });
    } catch (error) {
      next();
    }
  }

  async blockUser( req: Request, res: Response, next: NextFunction ): Promise<void> {
    try {
      const { userId } = req.body;

      await this.adminService.blockUser(userId);

      res.status(HttpStatus.OK).json({ success: true, message: "User block status updated" }); // ✅ return success response
    } catch (error) {
      next(error);
    }
  }

  async addCategories(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name } = req.body;
      if(!name){
        res.status(HttpStatus.BAD_REQUEST).json({success : false, error: "Category name is required"})
      }
      const newCategory = await this.adminService.addCategories(name)
      res.status(HttpStatus.OK).json({success : true, category: newCategory})
    } catch (error) {
      next(error)
    }
  }

  async getCategories(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const categories = await this.adminService.getCategories()
      res.status(HttpStatus.OK).json({success : true, categories})
    } catch (error) {
      next(error)
    }
  }

  async addSkills(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const{ name, category } = req.body
      if(!name || !name.trim()){
        res.status(HttpStatus.NOT_FOUND).json({message : "Skill name is required" })
      }
      const newSkill = await this.adminService.addSkills(name, category)
      res.status(HttpStatus.OK).json({success : true, skill : newSkill})
    } catch (error) {
      next(error)
    }
  }

  async getSkills( req: Request, res: Response, next: NextFunction ): Promise<void> {
    try {
      const skills = await this.adminService.getSkills();
      res.status(200).json({ success: true, skills });
    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  async editSkills( req: Request, res: Response, next: NextFunction ): Promise<void> {
    try {
      const { skillId, skillName } = req.body;
      console.log("Skill Id >>>> : ", skillId);
      console.log("Skill Name >>>> : ", skillName);

      if (!skillId || !skillName) {
        res.status(400).json({ error: "Invalid skill data" });
        return;
      }

      await this.adminService.editSkills(skillId, skillName);
      res.status(200).json({ message: "Skill updated successfully" });
    } catch (error) {
      next(error);
    }
  }

  async getOrdersList(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string)
      const limit = parseInt(req.query.limit as string)
      const {orders, total} = await this.adminService.getOrdersList(page, limit)
      const totalPages = Math.ceil(total / limit)
      res.status(200).json({ success: true, orderDetails: orders, total, totalPages, currentPage: page, limit})
    } catch (error) {
      next(error)
    }
  }

  async deleteCategoryAndSkills(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { categoryId } = req.params
      if (!categoryId) {
      res.status(400).json({ success: false, error: "Category ID is required" });
      }
      await this.adminService.deleteCategoryAndSkill(categoryId);
      res.status(200).json({ success: true, message: "Category and skills deleted successfully" });
    } catch (error) {
      next(error)
    }
  }

}
