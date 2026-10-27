import { ContactType } from "@/types/Type";
import { CreateContactInput } from "@/types/Type";

export interface IContactService {
  submitContact(data: CreateContactInput): Promise<void>;
  getContacts(status: string | undefined, page: number, limit: number): Promise<{ contacts: ContactType[]; total: number }>;
  updateStatus(id: string, status: string): Promise<void>;
}