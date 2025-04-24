import express from "express";
import { UserController } from "@/controllers/Implementation/UserController";
import { UserService } from "@/services/Implementation/UserService";
import { UserRepository } from "@/repositories/Implementation/UserRepository";
import { authMiddleware } from "@/middlewares/auth.middleware";
import signupValidation from "@/validation/signup-val.util";

const userRepo = new UserRepository();
const userService = new UserService(userRepo);
const userController = new UserController(userService);

const router = express.Router();

router.post("/signup", authMiddleware(signupValidation), userController.signup.bind(userController));

export default router;
