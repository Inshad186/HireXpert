import Client from "@/models/clientModel"
import Order from "@/models/orderModel"
import { IClientRepository } from "../Interface/IClientRepository"
import { ClientProfileType, OrderType } from "@/types/Type"
import { BaseRepository } from "../BaseRepository/implementation"

export class ClientRepository extends BaseRepository <ClientProfileType> implements IClientRepository {
    constructor() {
        super(Client)
    }
    async findd(client: string): Promise<OrderType[] > {
        try {
            const order = await Order.find({client})
            .populate("client", "name")
            .populate("freelancer", "name")
            .populate("gig", "title pricing.basic.price")
            return order
        } catch (error) {
            console.error(error)
            throw error
        }
    }
}