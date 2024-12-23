import { Model } from 'mongoose';
import { IAdminRepository } from '../interfaces/admin.repository.interface';
import { IUser } from '../interfaces/common.inteface';
import { BaseRepository } from '../repository/baseRepository';
import userSchema from "../models/userSchema";

class AdminRepository implements IAdminRepository {
    private userRepo: BaseRepository<IUser>;

    constructor(
        userSchema:Model<IUser>
    ){
        this.userRepo = new BaseRepository(userSchema)
    }

async getUsers(page:number,limit:number): Promise<{ users: IUser[]; total: number }> {
    try {
        const skip = (page - 1) * limit;
        const users = await this.userRepo.findAll({}, limit, skip);
        const total = await this.userRepo.countDocuments({});
        return { users, total };
      } catch (error: any) {
        console.error('Error fetching users:', error.message);
        throw new Error('Failed to fetch users. Please try again later.');
      }
}
async blockUser(email: string): Promise<boolean> {
    try {
        const findUser = await this.userRepo.find({ email: email });
        if (!findUser) {
            throw new Error('User not found');
        }
        console.log("block",findUser.isVerified);
        if (findUser.isVerified) {
            throw new Error('User is already blocked');
        }
        const updatedUser = await this.userRepo.update(
            { email: email },
            { $set: { isVerified: true } }
        );
        if (!updatedUser) {
            throw new Error('User could not be blocked');
        }
        return true;
    } catch (error: any) {
        console.error('Error in blocking user in repository:', error.message);
        throw error
    }
}
async unBlockUser(email: string): Promise<boolean> {
    try {
        const findUser = await this.userRepo.find({ email: email });
        if (!findUser) {
            throw new Error('User not found');
        }
        console.log("unblock",findUser.isVerified);
        
        if (!findUser.isVerified) {
            throw new Error('User is already unblocked');
        }
        const updatedUser = await this.userRepo.update(
            { email: email },
            { $set: { isVerified: false } }
        );
        if (!updatedUser) {
            throw new Error('User could not be unblocked');
        }

        return true;
    } catch (error: any) {
        console.error('Error in blocking user in repository:', error.message);
        throw error
    }
}
}
export default AdminRepository