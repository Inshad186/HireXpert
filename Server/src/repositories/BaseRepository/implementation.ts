import { Model } from "mongoose";
import { IBaseRepository } from "./interface";

export class BaseRepository<T> implements IBaseRepository<T> {
  protected model: Model<any>;

  constructor(model: Model<any>) {
    this.model = model;
  }

  async create(item: Partial<T>): Promise<T> {
    console.log("🌈🌈🌈🌈🌈 CREATED >> : ")
    const created = await this.model.create(item);
    console.log("🌈🌈🌈🌈🌈 CREATED >> : ",created)
    return created
  }

  async findById(id: string): Promise<T | null> {
    return await this.model.findById(id);
  }

  async update(id: string, item: Partial<T>): Promise<T | null> {
    return await this.model.findByIdAndUpdate(id, item, { new: true });
  }
}
