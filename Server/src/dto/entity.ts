import { AutoMap } from "@automapper/classes";
import { Types } from "mongoose";

export class PricingEntity {
  @AutoMap()
  basic!: { price: number; description: string; deliveryTime: number; };

  @AutoMap()
  standard!: { price: number; description: string; deliveryTime: number; };

  @AutoMap()
  premium!: { price: number; description: string; deliveryTime: number; };
}

export class GigEntity {
  @AutoMap()
  id?: string;

  @AutoMap()
  freelancer!: Types.ObjectId;

  @AutoMap()
  title!: string;

  @AutoMap()
  description!: string;

  @AutoMap()
  category!: string;

  @AutoMap(() => [String])
  skills!: Types.ObjectId[];

  @AutoMap(() => PricingEntity)
  pricing!: PricingEntity;

  @AutoMap(() => [String])
  gallery!: string[];
}
