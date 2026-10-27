import { GigType, GigFilters } from "@/types/Type";
import { IBaseRepository } from "../BaseRepository/interface";

export interface IGigRepository extends IBaseRepository<GigType> {
    findGigList(freelancerId: string):Promise<GigType[]>
    findGigs(filters: GigFilters): Promise<GigType[]>
    countActiveGigs(freelancerId: string): Promise<number>
}
