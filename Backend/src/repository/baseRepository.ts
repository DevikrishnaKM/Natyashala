import { Model, Document, Types } from 'mongoose';
import { IBaseRepository } from '../interfaces/base.repository.interface';

export class BaseRepository<T extends Document> implements IBaseRepository<T> {
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  async find(filter : object): Promise<T | null> {
    return this.model.findOne(filter).exec();
  }

  async findAll(filter: object = {}, limit: number = 10, skip: number = 0): Promise<T[]> {
    return this.model.find(filter).limit(limit).skip(skip).exec();
  }

  async create(item: Partial<T>): Promise<T> {
    const newItem = new this.model(item);
    return newItem.save();
  }

  async update(filter: object, updateData: object): Promise<boolean> {
    try {
        const result = await this.model.updateOne(filter, updateData).exec();
        return result.modifiedCount > 0; 
    } catch (error: any) {
        console.error('Error updating document:', error.message);
        throw new Error('Error updating document. Please try again later.');
    }
}

  async delete(id: Types.ObjectId | string): Promise<boolean> {
    const result = await this.model.findByIdAndDelete(id).exec();
    return !!result;
  }

  async countDocuments(filter: object = {}): Promise<number> {
    return await  this.model.countDocuments(filter).exec();
  }

  async updateAndReturn(filter: object, updateData: Partial<T>, options: object = { new: true }): Promise<T | null> {
    try {
        return await this.model.findOneAndUpdate(filter, updateData, options).exec();
    } catch (error: any) {
        console.error('Error updating and returning document:', error.message);
        throw new Error('Error updating and returning document. Please try again later.');
    }
}

}

export default BaseRepository;
