import express from "express"
import { AdminController } from "@/controllers/Implementation/AdminController";
import { AdminService } from "@/services/Implementation/AdminService";
import { AdminRepository } from "@/repositories/Implementation/AdminRepository";

const adminRepo = new AdminRepository()
const adminService = new AdminService(adminRepo)
const adminController = new AdminController(adminService)

const adminRouter = express.Router();

adminRouter.post("/login",adminController.login.bind(adminController))

export default adminRouter