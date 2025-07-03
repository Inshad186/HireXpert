import Client from "@/models/clientModel"
import { IClientRepository } from "../Interface/IClientRepository"
import { ClientProfileType } from "@/types/Type"
import { BaseRepository } from "../BaseRepository/implementation"

export class ClientRepository extends BaseRepository <ClientProfileType> implements IClientRepository {
    constructor() {
        super(Client)
    }
        async create(user: Partial<ClientProfileType>): Promise<ClientProfileType> {
        try {
            const userData = await this.model.create(user)
            return userData
        } catch (err) {
            console.log(err)
            throw new Error('Error creating user')
        }
    }

    async findById(id: string): Promise<ClientProfileType | null> {
        try {
            return await this.model.findById(id)
        } catch (err) {
            console.log(err)
            throw new Error("Error in finding a user")
        }
    }

    async updateUser(userId: string, user: Partial<ClientProfileType>): Promise<ClientProfileType | null> {
        try {
            return await this.model.findByIdAndUpdate(userId, user, {new : true})
        } catch (err) {
            console.log(err)
            throw new Error("Error in updating user")
        }
    }
}