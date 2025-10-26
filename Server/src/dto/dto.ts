import { AutoMap } from "@automapper/classes";
import { Types } from "mongoose";

export class PricingDTO {
  @AutoMap()
  basic!: { price: number; description: string; deliveryTime: number; };

  @AutoMap()
  standard!: { price: number; description: string; deliveryTime: number; };

  @AutoMap()
  premium!: { price: number; description: string; deliveryTime: number; };
}

export class CreateGigDTO {
  @AutoMap()
  title!: string;

  @AutoMap()
  freelancer!: Types.ObjectId;

  @AutoMap()
  category!: string;

  @AutoMap(() => [String])
  skills!: Types.ObjectId[];

  @AutoMap(() => PricingDTO)
  pricing!: PricingDTO;

  @AutoMap(() => [String])
  gallery!: string[];
}
