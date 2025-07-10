import express from "express"
import { AdminController } from "@/controllers/Implementation/AdminController";
import { AdminService } from "@/services/Implementation/AdminService";
import { AdminRepository } from "@/repositories/Implementation/AdminRepository";
import { allowRoles } from "@/middlewares/roleBase.middleware";
import { verifyTokenMiddleware } from "@/middlewares/verifyToken.middleware";

const adminRepo = new AdminRepository()
const adminService = new AdminService(adminRepo)
const adminController = new AdminController(adminService)

const adminRouter = express.Router();

adminRouter.post("/login", adminController.login.bind(adminController))
adminRouter.get("/dashboardStats", adminController.getDashboardStats.bind(adminController))
adminRouter.get("/usersList", adminController.getUsersList.bind(adminController))
adminRouter.patch("/block-user", adminController.blockUser.bind(adminController))
adminRouter.post("/addCategories", adminController.addCategories.bind(adminController))
adminRouter.get("/getCategories", adminController.getCategories.bind(adminController))
adminRouter.post("/addSkills", adminController.addSkills.bind(adminController))
adminRouter.get("/getSkills", adminController.getSkills.bind(adminController))
adminRouter.patch("/editSkills", adminController.editSkills.bind(adminController))
adminRouter.delete("/deleteCategory-Skill/:categoryId", adminController.deleteCategoryAndSkills.bind(adminController))

export default adminRouter