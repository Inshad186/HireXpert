import express from "express";
import { UserController } from "@/controllers/Implementation/UserController";
import { UserService } from "@/services/Implementation/UserService";
import { UserRepository } from "@/repositories/Implementation/UserRepository";

const userRepo = new UserRepository();
const userService = new UserService(userRepo);
const userController = new UserController(userService);

const router = express.Router();

router.post("/signup", (req, res, next) => userController.signup(req, res, next));

export default router;
