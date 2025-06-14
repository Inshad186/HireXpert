import express from "express";
import { UserController } from "@/controllers/Implementation/UserController";
import { UserService } from "@/services/Implementation/UserService";
import { UserRepository } from "@/repositories/Implementation/UserRepository";
import { authMiddleware } from "@/middlewares/auth.middleware";
import { signupValidation } from "@/utils/validation.util";
import { loginValidation } from "@/utils/validation.util";
import { upload } from "@/config/multer.config";
import { verifyTokenMiddleware } from "@/middlewares/verifyToken.middleware";
import { allowRoles } from "@/middlewares/roleBase.middleware";

const userRepo = new UserRepository();
const userService = new UserService(userRepo);
const userController = new UserController(userService);

const router = express.Router();

router.post("/signup", authMiddleware(signupValidation), userController.signup.bind(userController));
router.post("/login", userController.login.bind(userController))
router.post("/google-auth", userController.googleAuth.bind(userController))
router.post('/verifyOtp', userController.verifyOtp.bind(userController))
router.post("/resendOtp", userController.resendOtp.bind(userController))
router.patch("/assignRole",verifyTokenMiddleware, userController.assignRole.bind(userController))
router.post("/refreshToken", userController.refreshToken.bind(userController))
router.post("/changeProfile",verifyTokenMiddleware,allowRoles("client","freelancer"), upload.single("profileImage"), userController.updateProfile.bind(userController))
router.patch("/edit-user-name", verifyTokenMiddleware, allowRoles("client","freelancer"), userController.updateUserName.bind(userController))
router.get("/get-profile-img",verifyTokenMiddleware,allowRoles("client","freelancer"), userController.getProfileImage.bind(userController))
router.get("/get-freelancer",verifyTokenMiddleware, userController.getFreelancer.bind(userController))
router.post("/forget-password", userController.forgetPassword.bind(userController))
router.post("/reset-password", userController.resetPassword.bind(userController))
router.post("/update-userdetails",verifyTokenMiddleware, userController.updateUserDetails.bind(userController))

router.delete("/logout",userController.logout.bind(userController))

export default router;
