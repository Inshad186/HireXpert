import express from "express"
import rateLimit from "express-rate-limit";
import { ContactController } from "@/controllers/Implementation/ConctactController";
import { ContactService } from "@/services/Implementation/ContactService";
import { ContactRepository } from "@/repositories/Implementation/ContactRepository";
import { verifyTokenMiddleware } from "@/middlewares/verifyToken.middleware";

const contactRepo = new ContactRepository();
const contactService = new ContactService(contactRepo);
const contactController = new ContactController(contactService);

const router = express.Router();

const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,                   
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many messages. Please try again later." },
});

router.post("/contact", contactLimiter, contactController.submitContact.bind(contactController));

router.get("/admin/contacts", verifyTokenMiddleware, contactController.getContacts.bind(contactController));
router.patch("/admin/contacts/:id/status", verifyTokenMiddleware, contactController.updateStatus.bind(contactController));