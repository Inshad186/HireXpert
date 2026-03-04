import express from "express"
import { MessageController } from "@/controllers/Implementation/MessageController";
import { MessageService } from "@/services/Implementation/MessageService";
import { MessageRepository } from "@/repositories/Implementation/MessageRepository";

const messageRepo = new MessageRepository()
const messageService = new MessageService(messageRepo)
const messageController = new MessageController(messageService)

const router = express.Router();

router.get("/get_messages/:orderId",messageController.getOrderMessages.bind(messageController))

export default router