import { Model } from "mongoose";
import { IBaseRepository } from "./interface";

export class BaseRepository<T> implements IBaseRepository<T> {
  protected model: Model<any>;

  constructor(model: Model<any>) {
    this.model = model;
  }

    async createUser(user: T): Promise<T | null> {
      const userData = await this.model.create(user)
      console.log("User Repository User DAta",userData)
      return userData
    }

  async findById(id: string): Promise<T | null> {
    try {
      return await this.model.findById(id);
    } catch (error) {
      console.error(error);
      throw new Error("Error when finding by ID");
    }
  }

  async updateUser(userId : string, user: Partial<T>): Promise<T | null> {
    try {
      return await this.model.findByIdAndUpdate(userId, user, {new : true})
    } catch (error) {
      console.error(error)
      throw new Error("Error when updating the user")
    }
  }
}
