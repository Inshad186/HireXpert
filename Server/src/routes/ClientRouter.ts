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

const gigRepo = new GigRepository
const clientRepo = new ClientRepository();
const freelancerRepo = new FreelancerRepository
const clientService = new ClientService(clientRepo, gigRepo, freelancerRepo);
const clientController = new ClientController(clientService);

const router = express.Router();

router.post("/update-clientProfile",verifyTokenMiddleware, clientController.updateProfile.bind(clientController))
router.get("/get-gigs", verifyTokenMiddleware, clientController.getGigs.bind(clientController))
router.get("/get-ProjectDetail/:projectId", verifyTokenMiddleware, clientController.getProjectDetail.bind(clientController) )

export default router