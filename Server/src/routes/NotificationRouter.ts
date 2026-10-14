import express from "express"
import { verifyTokenMiddleware } from "@/middlewares/verifyToken.middleware";
import { NotificationRepository } from "@/repositories/Implementation/NotificationRepository";
import { NotificationService } from "@/services/Implementation/NotificationService";
import { NotificationController } from "@/controllers/Implementation/NotificationController";


const notificationRepo = new NotificationRepository();
const notificationService = new NotificationService(notificationRepo)
const notificationController = new NotificationController(notificationService)

const router = express.Router();
router.get("/get-notify", verifyTokenMiddleware, notificationController.getNotifications.bind(notificationController))
router.put("/mark-as-read/:notificationId", verifyTokenMiddleware, notificationController.markAsRead.bind(notificationController))
router.delete("/delete-notification/:notificationId", verifyTokenMiddleware, notificationController.deleteNotify.bind(notificationController))


export default router;