
export interface IBaseRepository<T> {
  createUser(user : Partial<T>) : Promise<T | null>
  findById(id: string): Promise<T | null>;
  updateUser(id : string, user: Partial<T>): Promise<T | null>;
}
