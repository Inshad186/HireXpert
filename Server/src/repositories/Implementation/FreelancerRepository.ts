import Freelancer from "@/models/freelancerModel"
import { IFreelancerRepository } from "../Interface/IFreelancerRepository"
import { FreelancerProfileType } from "@/types/Type"
import { BaseRepository } from "../BaseRepository/implementation"

export class FreelancerRepository extends BaseRepository <FreelancerProfileType> implements IFreelancerRepository {
    constructor() {
        super(Freelancer)
    }
    //     async createUser(user: Partial  <FreelancerProfileType>): Promise<FreelancerProfileType> {
    //     try {
    //         const userData = await this.model.create(user)
    //         return userData
    //     } catch (err) {
    //         console.log(err)
    //         throw new Error('Error creating user')
    //     }
    // }

    // async findById(id: string): Promise<FreelancerProfileType | null> {
    //     try {
    //         return await this.model.findById(id)
    //     } catch (err) {
    //         console.log(err)
    //         throw new Error("Error in finding a user")
    //     }
    // }

    // async updateUser(userId: string, user: Partial<FreelancerProfileType>): Promise<FreelancerProfileType | null> {
    //     try {
    //         return await this.model.findByIdAndUpdate(userId, user, {new : true})
    //     } catch (err) {
    //         console.log(err)
    //         throw new Error("Error in updating user")
    //     }
    // }

}