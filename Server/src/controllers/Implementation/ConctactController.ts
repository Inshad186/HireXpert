import { Request, Response, NextFunction } from "express";
import { IContactController } from "../Interface/IContactController";
import { IContactService } from "@/services/Interface/IContactService";
import { HttpStatus } from "@/constants/status.constant";

export class ContactController implements IContactController {
  constructor(private contactService: IContactService) {}

// ContactController.ts
async submitContact(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { name, email, subject, message, website } = req.body;

    // "website" is a hidden field. Real users leave it empty, and simple bots fill it.
    // We answer "success" and save nothing, so the bot learns nothing.
    if (website) {
      res.status(HttpStatus.OK).json({ success: true });
      return;
    }

    await this.contactService.submitContact({ name, email, subject, message });
    res.status(HttpStatus.OK).json({ success: true, message: "Thank you! We will get back to you soon." });
  } catch (error) {
    next(error);
  }
}

async getContacts(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const status = typeof req.query.status === "string" ? req.query.status : undefined;
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 20));

    const result = await this.contactService.getContacts(status, page, limit);
    res.status(HttpStatus.OK).json({ success: true, ...result, page, limit });
  } catch (error) {
    next(error);
  }
}

async updateStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await this.contactService.updateStatus(req.params.id, req.body.status);
    res.status(HttpStatus.OK).json({ success: true });
  } catch (error) {
    next(error);
  }
}

}