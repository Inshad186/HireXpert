
export interface IBaseRepository<T> {
  create(item: Partial<T>): Promise<T>;
  findById(id: string): Promise<T | null>;
  findByIdAndUpdate(id: string, item: Partial<T>): Promise<T | null>;
  find(filter:Record<string ,any>): Promise<T[]>
}
