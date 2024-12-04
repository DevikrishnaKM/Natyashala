import { Document, Model, Types } from 'mongoose';

export interface IBaseRepository<T extends Document> {
  find(filter : object): Promise<T | null>;
  findAll(filter?: object, limit?: number, skip?: number): Promise<T[]>;
  create(item: Partial<T>): Promise<T>;
  update(filter : object, updateData: Partial<T>): Promise<boolean>;
  updateAndReturn(filter: object, updateData: Partial<T>, options: object): Promise<T | null>
  delete(id: Types.ObjectId | string): Promise<boolean>;
}
