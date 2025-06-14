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
adminRouter.get("/getSkills", adminController.getSkills.bind(adminController))

export default adminRouter