import express from "express";
import { FreelancerController } from "@/controllers/Implementation/FreelancerController";
import { FreelancerService } from "@/services/Implementation/FreelancerService";
import { FreelancerRepository } from "@/repositories/Implementation/FreelancerRepository";
import { authMiddleware } from "@/middlewares/auth.middleware";
import { signupValidation } from "@/utils/validation.util";
import { loginValidation } from "@/utils/validation.util";
import { upload } from "@/config/multer.config";
import { verifyTokenMiddleware } from "@/middlewares/verifyToken.middleware";
import { allowRoles } from "@/middlewares/roleBase.middleware";

const freelancerRepo = new FreelancerRepository();
const freelancerService = new FreelancerService(freelancerRepo);
const freelancerController = new FreelancerController(freelancerService);

const router = express.Router();

router.post("/update-freelancerProfile",verifyTokenMiddleware, freelancerController.updateProfile.bind(freelancerController))

export default router