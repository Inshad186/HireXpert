import Client from "@/models/clientModel"
import { IClientRepository } from "../Interface/IClientRepository"
import { ClientProfileType } from "@/types/Type"
import { BaseRepository } from "../BaseRepository/implementation"

export class ClientRepository extends BaseRepository <ClientProfileType> implements IClientRepository {
    constructor() {
        super(Client)
    }
}