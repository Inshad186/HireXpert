import { IGigRepository } from "../Interface/IGigRepository";
import { BaseRepository } from "../BaseRepository/implementation";
import Gig from "@/models/gigModel";
import { GigType } from "@/types/Type";

export class GigRepository extends BaseRepository<GigType> implements IGigRepository {
  constructor() {
    super(Gig);
  }

  async findGigList(freelancerId: string): Promise<GigType[]> {
    return await Gig.find({freelancer : freelancerId})
  }

  async findGigs(): Promise<GigType[]> {
    return await Gig.find({isActive: true})
  }
}
