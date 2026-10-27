import { Types } from "mongoose";
import { HttpStatus } from "@/constants/status.constant";
import { generateHttpError } from "@/utils/http-error.util";
import { ContactType, CreateContactInput, ContactStatus } from "@/types/Type";
import { IContactService } from "../Interface/IContactService";
import { IContactRepository } from "@/repositories/Interface/IContactRepository";

const SUBJECTS = ["", "hiring", "freelancer", "billing", "other"];
const STATUSES = ["NEW", "READ", "RESOLVED"];
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class ContactService implements IContactService {
  constructor(private contactRepository: IContactRepository) {}

  async submitContact(data: CreateContactInput): Promise<void> {
    const name = typeof data.name === "string" ? data.name.trim() : "";
    const email = typeof data.email === "string" ? data.email.trim().toLowerCase() : "";
    const subject = typeof data.subject === "string" ? data.subject : "";
    const message = typeof data.message === "string" ? data.message.trim() : "";

    if (!name || name.length > 100) {
      throw generateHttpError(HttpStatus.BAD_REQUEST, "Please enter your name (up to 100 characters)");
    }
    if (!EMAIL_REGEX.test(email) || email.length > 150) {
      throw generateHttpError(HttpStatus.BAD_REQUEST, "Please enter a valid email address");
    }
    if (!SUBJECTS.includes(subject)) {
      throw generateHttpError(HttpStatus.BAD_REQUEST, "Please choose a valid subject");
    }
    if (message.length < 10 || message.length > 1000) {
      throw generateHttpError(HttpStatus.BAD_REQUEST, "Message must be between 10 and 1000 characters");
    }
    await this.contactRepository.create({ name, email, subject, message } as Partial<ContactType>);
  }

  async getContacts(status: string | undefined, page: number, limit: number) {
    if (status && !STATUSES.includes(status)) {
      throw generateHttpError(HttpStatus.BAD_REQUEST, "Invalid status");
    }
    return await this.contactRepository.findContacts(status, page, limit);
  }

  async updateStatus(id: string, status: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) throw generateHttpError(HttpStatus.BAD_REQUEST, "Invalid message id");
    if (!STATUSES.includes(status)) throw generateHttpError(HttpStatus.BAD_REQUEST, "Invalid status");
    await this.contactRepository.findByIdAndUpdate(id, { status:  status as ContactStatus });
  }
}