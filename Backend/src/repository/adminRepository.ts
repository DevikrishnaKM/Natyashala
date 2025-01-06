import { Model } from 'mongoose';
import { IAdminRepository } from '../interfaces/admin.repository.interface';
import { IUser,ITutorApplication } from '../interfaces/common.inteface';
import { BaseRepository } from '../repository/baseRepository';
import userSchema from "../models/userSchema";

class AdminRepository implements IAdminRepository {
    private userRepo: BaseRepository<IUser>;
    private applicationRepo : BaseRepository<ITutorApplication>;

    constructor(
        userSchema:Model<IUser>,
        applicationModel : Model<ITutorApplication>,
    ){
        this.userRepo = new BaseRepository(userSchema)
        this.applicationRepo = new BaseRepository(applicationModel);
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
async getApplications(): Promise<ITutorApplication[]> {
    try {
        return await this.applicationRepo.findAll({});
    } catch (error: any) {
        console.error('Error in fetching tutor applications:', error.message);
        throw error
    }
}

async findApplication(id : string) : Promise<ITutorApplication | null> {
    try {
        return await this.applicationRepo.find({applicationId : id})
    } catch (error : any) {
        console.error('Error in fetching tutor application:', error.message);
        throw error
    }
}
async addTutorCredential(email : string , passcode : string) : Promise<boolean > {
    try {
       return await this.userRepo.update(
        {email : email} ,
        {
          $set: {
            isApprovedTutor: true,
            tutorCredentials: {
              email: email,
              passwordHash: passcode,
            },
          },
        }
    )
    } catch (error : any) {
        console.error('Error in fetching tutor application:', error.message);
        throw error
    }
}
}
export default AdminRepository