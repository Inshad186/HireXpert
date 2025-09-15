import { GigType } from "@/types/Type";
import { IBaseRepository } from "../BaseRepository/interface";

export interface IGigRepository extends IBaseRepository<GigType> {
    findGigList(freelancerId: string):Promise<GigType[]>
    findGigs(): Promise<GigType[]>
}
