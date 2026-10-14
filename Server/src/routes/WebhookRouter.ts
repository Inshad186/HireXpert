import express from "express"
import { WebhookController } from "@/controllers/Implementation/WebhookController";
import { WebhookService } from "@/services/Implementation/WebhookService";
import { OrderRepository } from "@/repositories/Implementation/OrderRepository";
import { NotificationService } from "@/services/Implementation/NotificationService";
import { NotificationRepository } from "@/repositories/Implementation/NotificationRepository";

const orderRepo = new OrderRepository()
const notificationRepo = new NotificationRepository()
const notificationService = new NotificationService(notificationRepo)
const webhookService = new WebhookService(orderRepo, notificationService)
const webhookController = new WebhookController(webhookService)

const router = express.Router();

router.post("/stripe", express.raw({ type: "application/json" }), webhookController.handleStripeWebhook.bind(webhookController));

export default router;