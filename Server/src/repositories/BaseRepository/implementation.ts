import { Model } from "mongoose";
import { IBaseRepository } from "./interface";

export class BaseRepository<T> implements IBaseRepository<T> {
  private model: Model<any>;

  constructor(model: Model<any>) {
    this.model = model;
  }

  async findById(id: string): Promise<T | null> {
    try {
      return await this.model.findById(id);
    } catch (error) {
      console.error(error);
      throw new Error("Error when finding by ID");
    }
  }
}
