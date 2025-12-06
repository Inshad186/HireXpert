import express from "express";
import { ClientController } from "@/controllers/Implementation/ClientController";
import { ClientService } from "@/services/Implementation/ClientService";
import { ClientRepository } from "@/repositories/Implementation/ClientRepository";
import { authMiddleware } from "@/middlewares/auth.middleware";
import { signupValidation } from "@/utils/validation.util";
import { loginValidation } from "@/utils/validation.util";
import { upload } from "@/config/multer.config";
import { verifyTokenMiddleware } from "@/middlewares/verifyToken.middleware";
import { allowRoles } from "@/middlewares/roleBase.middleware";
import { GigRepository } from "@/repositories/Implementation/GigRepository";
import { FreelancerRepository } from "@/repositories/Implementation/FreelancerRepository";
import { UserRepository } from "@/repositories/Implementation/UserRepository";
import { OrderRepository } from "@/repositories/Implementation/OrderRepository";

const gigRepo = new GigRepository
const clientRepo = new ClientRepository();
const freelancerRepo = new FreelancerRepository
const userRepo = new UserRepository
const orderRepo = new OrderRepository
const clientService = new ClientService(clientRepo, gigRepo, freelancerRepo, userRepo, orderRepo);
const clientController = new ClientController(clientService);

const router = express.Router();

router.post("/update-clientProfile",verifyTokenMiddleware, clientController.updateProfile.bind(clientController))
router.get("/get-gigs", verifyTokenMiddleware, clientController.getGigs.bind(clientController))
router.get("/get-ProjectDetail/:projectId", verifyTokenMiddleware, clientController.getProjectDetail.bind(clientController))
router.post("/create-order", verifyTokenMiddleware, clientController.createOrder.bind(clientController))
router.get("/my-orders", verifyTokenMiddleware, clientController.getMyOrders.bind(clientController))

export default router