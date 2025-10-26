import { createMap, forMember, mapFrom } from "@automapper/core";
import { mapper } from "@/config/mapper.config";
import { CreateGigDTO, PricingDTO } from "../dto/dto";
import { GigEntity, PricingEntity } from "../dto/entity";

export const gigMapper = () => {
  // 1️⃣ Map PricingDTO → PricingEntity, including nested structure
  createMap(
    mapper,
    PricingDTO,
    PricingEntity,
    forMember(
      (dest) => dest.basic,
      mapFrom((src) => src.basic)
    ),
    forMember(
      (dest) => dest.standard,
      mapFrom((src) => src.standard)
    ),
    forMember(
      (dest) => dest.premium,
      mapFrom((src) => src.premium)
    )
  );

  // 2️⃣ Map CreateGigDTO → GigEntity
  createMap(
    mapper,
    CreateGigDTO,
    GigEntity,
    forMember(
      (dest) => dest.pricing,
      mapFrom((src) => src.pricing)
    )
  );
};
