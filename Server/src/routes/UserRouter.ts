import express from "express";
import { UserController } from "@/controllers/Implementation/UserController";
import { UserService } from "@/services/Implementation/UserService";
import { UserRepository } from "@/repositories/Implementation/UserRepository";
import { authMiddleware } from "@/middlewares/auth.middleware";
import { signupValidation } from "@/utils/validation.util";
import { loginValidation } from "@/utils/validation.util";
import { upload } from "@/config/multer.config";

const userRepo = new UserRepository();
const userService = new UserService(userRepo);
const userController = new UserController(userService);

const router = express.Router();

router.post("/signup", authMiddleware(signupValidation), userController.signup.bind(userController));
router.post("/login", userController.login.bind(userController))
router.post('/verifyOtp', userController.verifyOtp.bind(userController))
router.post("/resendOtp", userController.resendOtp.bind(userController))
router.patch("/assignRole", userController.assignRole.bind(userController))
router.post("/changeProfile", upload.single("profileImage"), userController.updateProfile.bind(userController))

router.delete("/logout",userController.logout.bind(userController))

export default router;
