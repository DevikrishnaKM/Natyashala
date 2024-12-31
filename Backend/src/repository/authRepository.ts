import { Model } from "mongoose";
import { IUser, ICleanedUser } from "../interfaces/common.inteface";
import { IAuthRepository } from "../interfaces/auth.repository.interface";
import BaseRepository from "./baseRepository";
import bcrypt from "bcrypt";
import TutorProfile from "../models/tutorProfileModel";

class AuthRepository implements IAuthRepository {
  private userRepo: BaseRepository<IUser>;

  constructor(userModel: Model<IUser>) {
    this.userRepo = new BaseRepository(userModel);
  }

  async findUser(email: string): Promise<IUser | null> {
    try {
      const User = await this.userRepo.find({ email });
      return User;
    } catch (error: any) {
      console.error("Error fetching user in auth-controller", error.message);
      throw error;
    }
  }
  async createUser(userData: {
    name: string;
    email: string;
    phone: string;
    password: string;
    role: "user" | "tutor";
  }): Promise<IUser> {
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

  async validateLoginUser(
    email: string,
    password: string
  ): Promise<ICleanedUser> {
    try {
      const user = await this.userRepo.find({ email });
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

  async saveProfile(userId: string, profileUrl: string): Promise<boolean> {
    try {
      return await this.userRepo.update({ userId }, { profile: profileUrl });
    } catch (error: any) {
      console.log("Error in saving profile  in user repo", error.message);
      throw new Error(error.message);
    }
  }
  async editUser(userid: string, newUserInfo: object): Promise<IUser | null> {
    try {
      return await this.userRepo.updateAndReturn(
        { userId: userid },
        newUserInfo
      );
    } catch (error: any) {
      throw error;
    }
  }
  async getApplicantData(email: string): Promise<any> {
    try {
      const tutorData = await TutorProfile.findOne(
        { email: email },
        {
          _id: 0,
          applicationId: 1,
          tutorRole: 1,
          education: 1,
          experience: 1,
          bio: 1,
          role: 1,
          language: 1,
          country: 1,
          profilePhotoUrl: 1,
          email: 1,
          userId: 1,
        }
      );

      const tutor = {
        userId: tutorData?.userId,
        bio: tutorData?.bio,
        tutorRole: tutorData?.role,
        email: email,
        education: tutorData?.education,
        country: tutorData?.country,
        experience: tutorData?.experience,
        language: tutorData?.language,
        profilePhotoUrl: tutorData?.profilePhotoUrl,
      };
      return tutor;
    } catch (error: any) {
      console.log("Error in getting applicant data user repo", error.message);
      throw new Error(error.message);
    }
  }
}
export default AuthRepository;
