import { Model } from "mongoose";
import { IBaseRepository } from "./interface";

export class BaseRepository<T> implements IBaseRepository<T> {
  protected model: Model<any>;

  constructor(model: Model<any>) {
    this.model = model;
  }

  async create(item: Partial<T>): Promise<T> {
    const created = await this.model.create(item);
    return created
  }

  async find(filter: Record<string, any>): Promise<T[]> {
    return await this.model.find(filter).sort({ createdAt: -1})
  }

  async findById(id: string): Promise<T | null> {
    return await this.model.findById(id);
  }

  async findByIdAndUpdate(id: string, item: Partial<T>): Promise<T | null> {
    return await this.model.findByIdAndUpdate(id, item, { new: true });
  }
}
