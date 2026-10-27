import { ContactType } from "@/types/Type";
import { IBaseRepository } from "../BaseRepository/interface";


export interface IContactRepository extends IBaseRepository<ContactType> {
  findContacts(status: string | undefined, page: number, limit: number): Promise<{ contacts: ContactType[]; total: number }>;
}