import { IGigRepository } from "../Interface/IGigRepository";
import { BaseRepository } from "../BaseRepository/implementation";
import Gig from "@/models/gigModel";
import { GigType } from "@/types/Type";

export class GigRepository extends BaseRepository<GigType> implements IGigRepository {
  constructor() {
    super(Gig);
  }

}
