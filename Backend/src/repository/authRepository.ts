import {Model} from "mongoose";
import {IUser,ICleanedUser} from "../interfaces/common.inteface";
import {IAuthRepository} from "../interfaces/auth.repository.interface";
import BaseRepository from "./baseRepository";
import bcrypt from "bcrypt";


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
    async createUser(userData: { name: string, email: string, phone: string, password: string ,role:'user'|'tutor'}): Promise<IUser> {
        try {
            console.log("Creating new user with:", userData);
            const newUser = await this.userRepo.create(userData); // Assuming `userRepo` is the MongoDB repository
            // console.log("User created successfully:", newUser);
            return newUser;
        } catch (error: any) {
          console.log("Error in creating new User", error);
          throw new Error(`Error creating user : ${error.message}`);
        }
    }

    async validateLoginUser(email: string, password: string): Promise<ICleanedUser> {
      try {
        const user = await this.userRepo.find({ email })
        // console.log("user",user)
    
        if (!user) {
          throw new Error("User doesn't exist");
        }
    
        if (user.isVerified === true) {
          throw new Error("You are restricted.");
        }
    
        // Ensure password field is defined before comparison
        if (!user.password) {
          throw new Error("Password not found in user data.");
        }
    
        const isMatch = await bcrypt.compare(password, user.password);
    
        if (!isMatch) {
          throw new Error("Invalid password");
        }
    
        const userData = {
          userId: user.userId,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          isVerified: user.isVerified,
          profilePicture: user.profilePicture || "",
        };
    
        return userData;
      } catch (error: any) {
        console.error("Error in validateLoginUser:", error.message);
        throw error;
      }
    }
 }
export default AuthRepository;







