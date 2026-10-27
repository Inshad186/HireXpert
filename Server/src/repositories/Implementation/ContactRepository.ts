import Contact from "@/models/contactModel";
import { IContactRepository } from "../Interface/IContactRepository";
import { ContactType } from "@/types/Type";
import { BaseRepository } from "../BaseRepository/implementation";

export class ContactRepository extends BaseRepository <ContactType> implements IContactRepository {

  constructor(){
    super(Contact)
  }

    async findContacts(status: string | undefined, page: number, limit: number) {
    const filter = status ? { status } : {};
    const [contacts, total] = await Promise.all([
        Contact.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
        Contact.countDocuments(filter),
    ]);
    return { contacts: contacts as unknown as ContactType[], total };
    }
}