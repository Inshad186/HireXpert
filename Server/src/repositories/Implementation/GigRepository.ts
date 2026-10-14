import { IGigRepository } from "../Interface/IGigRepository";
import { BaseRepository } from "../BaseRepository/implementation";
import Gig from "@/models/gigModel";
import { GigType, GigFilters } from "@/types/Type";
import Freelancer from "@/models/freelancerModel"

export class GigRepository extends BaseRepository<GigType> implements IGigRepository {
  constructor() {
    super(Gig);
  }

  async findGigList(freelancerId: string): Promise<GigType[]> {
    return await Gig.find({freelancer : freelancerId})
  }
  

  async findGigs(filters: GigFilters = {}): Promise<GigType[]> {
    const escapeRegex = (text: string) =>
    text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const { search, category, minPrice, maxPrice, minRating } = filters;
    const query: Record<string, any> = { isActive: true };

    if (search) query.title = { $regex: escapeRegex(search), $options: "i" };
    if (category) query.category = category;

    if (minPrice !== undefined || maxPrice !== undefined) {
      query["pricing.basic.price"] = {};
      if (minPrice !== undefined) query["pricing.basic.price"].$gte = minPrice;
      if (maxPrice !== undefined) query["pricing.basic.price"].$lte = maxPrice;
    }

    if (minRating !== undefined) {
      const freelancers = await Freelancer.find({
        "rating.average": { $gte: minRating },
      }).select("_id");
      query.freelancer = { $in: freelancers.map((f) => f._id) };
    }

    return await Gig.find(query).populate("freelancer", "rating");
  }

}
