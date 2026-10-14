import express, { application } from "express";
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
import { NotificationRepository } from "@/repositories/Implementation/NotificationRepository";
import { NotificationService } from "@/services/Implementation/NotificationService";

const gigRepo = new GigRepository
const clientRepo = new ClientRepository();
const freelancerRepo = new FreelancerRepository
const userRepo = new UserRepository
const orderRepo = new OrderRepository
const notificationRepo = new NotificationRepository

const notificationService = new NotificationService(notificationRepo)
const clientService = new ClientService(clientRepo, gigRepo, freelancerRepo, userRepo, orderRepo, notificationService);
const clientController = new ClientController(clientService);

const router = express.Router();

router.post("/update-clientProfile",verifyTokenMiddleware, clientController.updateProfile.bind(clientController))
router.get("/get-gigs", verifyTokenMiddleware, clientController.getGigs.bind(clientController))
router.get("/get-ProjectDetail/:projectId", verifyTokenMiddleware, clientController.getProjectDetail.bind(clientController))
router.post("/create-order", verifyTokenMiddleware, clientController.createOrder.bind(clientController))
router.get("/my-orders", verifyTokenMiddleware, clientController.getMyOrders.bind(clientController))
router.patch("/accept-orders/:orderId", verifyTokenMiddleware, clientController.acceptOrders.bind(clientController))
router.patch("/request-revision/:orderId", verifyTokenMiddleware, clientController.requestRevision.bind(clientController))
router.post("/create-payment-intent", verifyTokenMiddleware, clientController.createPaymentIntent.bind(clientController))
// router.get("/get-freelancer-reviews/:projectId", verifyTokenMiddleware, clientController.getFreelancerReviews.bind(clientController))

export default router