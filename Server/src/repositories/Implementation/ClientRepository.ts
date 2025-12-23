import Client from "@/models/clientModel"
import Order from "@/models/orderModel"
import { IClientRepository } from "../Interface/IClientRepository"
import { ClientProfileType, OrderType } from "@/types/Type"
import { BaseRepository } from "../BaseRepository/implementation"

export class ClientRepository extends BaseRepository <ClientProfileType> implements IClientRepository {
    constructor() {
        super(Client)
    }
}