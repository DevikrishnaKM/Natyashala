import { Model } from "mongoose";
import { IAdminRepository } from "../interfaces/admin.repository.interface";
import {
  IUser,
  ITutorApplication,
  ICategory,
  ICourse,
} from "../interfaces/common.inteface";
import { BaseRepository } from "../repository/baseRepository";
import userSchema from "../models/userSchema";
import AdminTransaction from "../models/adminTransactionModel";
import { Course } from "../models/courseModel";

class AdminRepository implements IAdminRepository {
  private userRepo: BaseRepository<IUser>;
  private applicationRepo: BaseRepository<ITutorApplication>;
  private categoryRepo: BaseRepository<ICategory>;
  private courseRepo: BaseRepository<ICourse>;

  constructor(
    userSchema: Model<IUser>,
    applicationModel: Model<ITutorApplication>,
    categoryModel: Model<ICategory>,
    courseModel: Model<ICourse>
  ) {
    this.userRepo = new BaseRepository(userSchema);
    this.applicationRepo = new BaseRepository(applicationModel);
    this.categoryRepo = new BaseRepository(categoryModel);
    this.courseRepo = new BaseRepository(courseModel);
  }

  async getUsers(
    page: number,
    limit: number
  ): Promise<{ users: IUser[]; total: number }> {
    try {
      const skip = (page - 1) * limit;
      const users = await this.userRepo.findAll({}, limit, skip);
      const total = await this.userRepo.countDocuments({});
      return { users, total };
    } catch (error: any) {
      console.error("Error fetching users:", error.message);
      throw new Error("Failed to fetch users. Please try again later.");
    }
  }
  async blockUser(email: string): Promise<boolean> {
    try {
      const findUser = await this.userRepo.find({ email: email });
      if (!findUser) {
        throw new Error("User not found");
      }
      console.log("block", findUser.isVerified);
      if (findUser.isVerified) {
        throw new Error("User is already blocked");
      }
      const updatedUser = await this.userRepo.update(
        { email: email },
        { $set: { isVerified: true } }
      );
      console.log("res n blovk:",updatedUser)
      if (!updatedUser) {
        throw new Error("User could not be blocked");
      }
      return true;
    } catch (error: any) {
      console.error("Error in blocking user in repository:", error.message);
      throw error;
    }
  }
  async unBlockUser(email: string): Promise<boolean> {
    try {
      const findUser = await this.userRepo.find({ email: email });
      if (!findUser) {
        throw new Error("User not found");
      }
      console.log("unblock", findUser.isVerified);

      if (!findUser.isVerified) {
        throw new Error("User is already unblocked");
      }
      const updatedUser = await this.userRepo.update(
        { email: email },
        { $set: { isVerified: false } }
      );
      if (!updatedUser) {
        throw new Error("User could not be unblocked");
      }

      return true;
    } catch (error: any) {
      console.error("Error in blocking user in repository:", error.message);
      throw error;
    }
  }
  async getApplications(): Promise<ITutorApplication[]> {
    try {
      return await this.applicationRepo.findAll({});
    } catch (error: any) {
      console.error("Error in fetching tutor applications:", error.message);
      throw error;
    }
  }

  async findApplication(id: string): Promise<ITutorApplication | null> {
    try {
      return await this.applicationRepo.find({ applicationId: id });
    } catch (error: any) {
      console.error("Error in fetching tutor application:", error.message);
      throw error;
    }
  }

  async changeStatus(id: string): Promise<ITutorApplication | any> {
    try {
      return await this.applicationRepo.update(
        { applicationId: id },
        {
          $set: {
            status: "accepted",
          },
        }
      );
    } catch (error: any) {
      console.error("Error in fetching tutor status:", error.message);
      throw error;
    }
  }
  async updateStatus(id: string): Promise<ITutorApplication | any> {
    try {
      return await this.applicationRepo.update(
        { applicationId: id },
        {
          $set: {
            status: "rejected",
          },
        }
      );
    } catch (error: any) {
      console.error("Error in fetching tutor status:", error.message);
      throw error;
    }
  }

  async addTutorCredential(email: string, passcode: string): Promise<boolean> {
    try {
      return await this.userRepo.update(
        { email: email },
        {
          $set: {
            isApprovedTutor: true,
            tutorCredentials: {
              email: email,
              passwordHash: passcode,
            },
          },
        }
      );
    } catch (error: any) {
      console.error("Error in fetching tutor application:", error.message);
      throw error;
    }
  }

  async getTutors(
    page: number,
    limit: number
  ): Promise<{ tutors: IUser[]; total: number }> {
    try {
      const skip = (page - 1) * limit;
      const tutors = await this.userRepo.findAll(
        { isApprovedTutor: true },
        limit,
        skip
      );
      const total = await this.userRepo.countDocuments({
        IsApprovedTutor: true,
      });
      return { tutors, total };
    } catch (error: any) {
      console.error("Error fetching users:", error.message);
      throw error;
    }
  }

  async createCategory(
    categoryName: string,
    description: string
  ): Promise<boolean> {
    try {
      const existCategory = await this.categoryRepo.find({
        name: categoryName,
      });
      if (existCategory) {
        throw new Error("Category already exists.");
      }
      await this.categoryRepo.create({
        name: categoryName,
        description: description,
      });
      return true;
    } catch (error: any) {
      console.error("Error in creating category in admin repo", error.message);
      throw error;
    }
  }

  async getCategories(): Promise<ICategory[]> {
    try {
      return await this.categoryRepo.findAll({});
    } catch (error: any) {
      console.error("Error in finding categories in admin repo", error.message);
      throw error;
    }
  }
  async getCourses(
    skip: number,
    limit: number
  ): Promise<{ courses: ICourse[]; totalCourses: number }> {
    try {
      const totalCourses = await this.courseRepo.countDocuments();
      const courses = await this.courseRepo.findAll({}, limit, skip);
      return {
        courses,
        totalCourses,
      };
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  async adminPaymentWallet(adminShare: any, data: any): Promise<any> {
    try {
      const transactionData = {
        transactionId: data.transactionId,
        amount: adminShare,
        course: {
          courseId: data.courseId,
          courseName: data.course,
          tutor: {
            tutorId: data.tutorId,
            tutorName: data.tutor,
          },
        },
        status: "completed",
      };
      const transaction = new AdminTransaction(transactionData);
      await transaction.save();
    } catch (error: any) {
      console.log("error in saving admin share", error.message);
      throw new error.message();
    }
  }
  async blockCourse(courseId: string): Promise<string> {
    try {
      const status = await this.courseRepo.update(
        { courseId: courseId },
        { isBlocked: true }
      );
      if (!status) {
        throw new Error("Course dosent exist");
      }
      return "blocked";
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async unBlockCourse(courseId: string): Promise<string> {
    try {
      const status = await this.courseRepo.update(
        { courseId: courseId },
        { isBlocked: false }
      );
      if (!status) {
        throw new Error("Course dosent exist");
      }
      return "unblocked";
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  async findCourse(id: string): Promise<ICourse[]> {
    try {
      const result = await this.courseRepo.find({ courseId: id });

      // Ensure the result is an array
      if (!result) {
        return [];
      }
      return Array.isArray(result) ? result : [result];
    } catch (error: any) {
      console.error("Error in fetching course details:", error.message);
      throw error;
    }
  }

  async acceptCourse(_id: string): Promise<any> {
    try {
      const result = await Course.findByIdAndUpdate(
        _id,
        { isVerified: true },
        { new: true }
      );

      if (!result) {
        return [];
      }
      await result.save();

      return result;
    } catch (error: any) {
      console.error("Error in fetching course details:", error.message);
      throw error;
    }
  }
}
export default AdminRepository;
