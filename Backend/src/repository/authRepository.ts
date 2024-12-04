import {Model} from "mongoose";
import {IUser} from "../interfaces/common.inteface";
import {IAuthRepository} from "../interfaces/auth.repository.interface";
import BaseRepository from "./baseRepository";
// import bcrypt from "bcrypt";

class AuthRepository implements IAuthRepository{

    private userRepo: BaseRepository<IUser>;

    constructor(userModel: Model<IUser>) {
        this.userRepo = new BaseRepository(userModel);
    }

    async findUser(email:string):Promise<IUser | null>{
        try {
            const User = await this.userRepo.find({email});
            return User
        } catch (error:any) {
            console.error("Error fetching user in auth-controller",error.message);
            throw error;
        }
    }
}
export default AuthRepository;







