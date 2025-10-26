import Freelancer from "@/models/freelancerModel"
import { IFreelancerRepository } from "../Interface/IFreelancerRepository"
import { FreelancerProfileType } from "@/types/Type"
import { BaseRepository } from "../BaseRepository/implementation"

export class FreelancerRepository extends BaseRepository <FreelancerProfileType> implements IFreelancerRepository {
    constructor() {
        super(Freelancer)
    }

}