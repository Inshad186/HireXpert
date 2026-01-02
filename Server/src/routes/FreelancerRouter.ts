import express from "express";
import { FreelancerController } from "@/controllers/Implementation/FreelancerController";
import { FreelancerService } from "@/services/Implementation/FreelancerService";
import { FreelancerRepository } from "@/repositories/Implementation/FreelancerRepository";
import { authMiddleware } from "@/middlewares/auth.middleware";
import { signupValidation } from "@/utils/validation.util";
import { loginValidation } from "@/utils/validation.util";
import { upload } from "@/config/multer.config";
import { uploadDeliveryFiles } from "@/config/multer.config";
import { verifyTokenMiddleware } from "@/middlewares/verifyToken.middleware";
import { allowRoles } from "@/middlewares/roleBase.middleware";
import { GigRepository } from "@/repositories/Implementation/GigRepository";
import { OrderRepository } from "@/repositories/Implementation/OrderRepository";
import { UserRepository } from "@/repositories/Implementation/UserRepository";

const gigRepo = new GigRepository()
const freelancerRepo = new FreelancerRepository();
const OrderRepo = new OrderRepository()
const userRepo = new UserRepository()

const freelancerService = new FreelancerService(freelancerRepo, gigRepo, OrderRepo, userRepo);
const freelancerController = new FreelancerController(freelancerService);

const router = express.Router();

router.post("/update-freelancerProfile",verifyTokenMiddleware, freelancerController.updateProfile.bind(freelancerController))
router.post("/create-gig", verifyTokenMiddleware, upload.array("gallery",3), freelancerController.createGig.bind(freelancerController))
router.get("/listed-gig", verifyTokenMiddleware, freelancerController.getGigList.bind(freelancerController))
router.put("/update-gig-status", verifyTokenMiddleware, freelancerController.updateGigStatus.bind(freelancerController))
router.get("/freelancer-dashStats", verifyTokenMiddleware, freelancerController.getFreelancerDashStats.bind(freelancerController))
router.get("/order-list", verifyTokenMiddleware, freelancerController.getOrderList.bind(freelancerController))
router.get("/orders/:orderId", verifyTokenMiddleware, freelancerController.getOrders.bind(freelancerController))
router.patch("/accept-order/:orderId", verifyTokenMiddleware, freelancerController.acceptOrder.bind(freelancerController))
router.patch("/reject-order/:orderId/:reason", verifyTokenMiddleware, freelancerController.rejectOrder.bind(freelancerController))
router.patch("/inProgress-order/:orderId", verifyTokenMiddleware, freelancerController.inprogressOrder.bind(freelancerController))
router.patch("/delivery-order/:orderId", verifyTokenMiddleware, uploadDeliveryFiles.array("files",3), freelancerController.deliveryOrder.bind(freelancerController))

export default router