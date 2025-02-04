import { Model } from "mongoose";
import {
  IUser,
  ICleanedUser,
  ICourse,
  IOrder,
  IWallet,
  IRating,
} from "../interfaces/common.inteface";
import { IAuthRepository } from "../interfaces/auth.repository.interface";
import BaseRepository from "./baseRepository";
import bcrypt from "bcrypt";
import TutorProfile from "../models/tutorProfileModel";
import { Course } from "../models/courseModel";
import { Wallet } from "../models/walletModel";
import Order from "../models/orderModel";
import Rating from "../models/ratingModel";

class AuthRepository implements IAuthRepository {
  private userRepo: BaseRepository<IUser>;
  private courseRepo: BaseRepository<ICourse>;

  constructor(userModel: Model<IUser>, courseModel: Model<ICourse>) {
    this.userRepo = new BaseRepository(userModel);
    this.courseRepo = new BaseRepository(courseModel);
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
  async findUserById(userId: string): Promise<IUser> {
    try {
      const user = await this.userRepo.find({userId})
      if(!user) {
        throw new Error("User dosent exist.")
      }
      return user;
    } catch ( error : any) {
    console.error('Error fetching user in user-controller:', error.message);
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
      const updateResult = await this.userRepo.update(
        { userId },
        { $set: { profilePicture: profileUrl } }
      );

      return updateResult;
    } catch (error: any) {
      console.error("Error in saving profile in repository:", error.message);
      throw new Error("Failed to save profile URL");
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
  async getCourse(id: string): Promise<ICourse> {
    try {
      const course = await Course.findOne(
        { courseId: id },
        { isBlocked: false }
      )
        .populate({
          path: "sections",
          populate: { path: "videos" },
        })
        .exec();

      if (!course) {
        throw new Error("Cannot find course.");
      }

      return course;
    } catch (error: any) {
      console.log("Error in getting course detail user repo", error.message);
      throw error;
    }
  }

  async getCourses(
    category: string,
    page: number,
    limit: number,
    filter?: string
  ): Promise<{ courses: any; totalPages: number }> {
    try {
      // Define the base filter
      let queryFilter: { isBlocked: boolean; category?: string;isVerified:boolean } = {
        isBlocked: false,isVerified:true
      };

      if (category && category !== "All") {
        queryFilter.category = category;
      } else if (category && category === "All") {
        queryFilter = { isBlocked: false,isVerified:true };
      }

      // Pagination logic
      const skip = (page - 1) * limit;
      const totalCourses = await Course.countDocuments(queryFilter).exec();
      const totalPages = Math.ceil(totalCourses / limit);

      // Fetch courses
      const courses = await Course.find(queryFilter)
        .lean() // Ensure plain JavaScript objects match `ICourse`
        .skip(skip)
        .limit(limit)
        .exec();

      return {
        courses,
        totalPages,
      };
    } catch (error: any) {
      console.error(
        "Error in getting courses in auth repository:",
        error.message
      );
      throw error;
    }
  }

  async courseDetails(id: string): Promise<any> {
    try {
      const course = await Course.findOne(
        { courseId: id },
        { isBlocked: false }
      )
        .populate({
          path: "sections",
          populate: { path: "videos" },
        })
        .exec();

      if (!course) {
        throw new Error("cannot find course");
      }

      const tutor = await TutorProfile.findOne({ email: course.email });
      if (!tutor) {
        throw new Error("cannot find tutor");
      }

      const userTutor = await this.userRepo.find({ email: tutor?.email });
      if (!userTutor) {
        throw new Error("Cannot find userTutor.");
      }

      const CourseData = {
        id: course._id,
        name: course.name,
        description: course.description,
        Category: course.category,
        sections: course.sections,
        tags: course.tags,
        language: course.language,
        ratings: course.ratings,
        comments: course.comments,
        thumbnail: course.thumbnail,
        tutorName: userTutor.name,
        tutorBio: tutor.bio,
        tutorEmail: tutor?.email,
        tutorProfile: userTutor?.profilePicture,
        tutorId: userTutor?.userId,
        education: tutor.education,
        certifications: tutor.certifications,
        email: tutor.email,
        courseId: course.courseId,
        price: course.price,
        users: course?.users?.length,
      };

      return CourseData;
    } catch (error: any) {
      console.log("Error in getting course detail user repo", error.message);
      throw new Error(error.message);
    }
  }

  saveOder = async (orderData: any): Promise<boolean> => {
    try {
      const order = await new Order(orderData);
      await order.save();
      return true;
    } catch (error: any) {
      console.log("Error in saving order data in user repo", error.message);
      throw new Error(error.message);
    }
  };

  updateOrder = async (sessionId: any, orderId: any): Promise<boolean> => {
    try {
      const order = await Order.updateOne(
        { OrderId: orderId },
        {
          $push: { paymentId: sessionId },
        }
      );

      console.log("order:", order);
      return true;
    } catch (error: any) {
      console.log("Error in update Order", error.message);
      throw new Error(error.message);
    }
  };

  async confirmOrder(orderId: string): Promise<any> {
    try {
      // Find the order by a custom ID or ObjectId
      const order = await Order.findOneAndUpdate({ orderId: orderId },{paymentStatus:"Completed"},{new:true});

      // Check if the order exists
      if (!order) {
        throw new Error("Order not found");
      }
      return order;
    } catch (error: any) {
      console.log("Error in confirm Order", error.message);
      throw new Error(error.message);
    }
  }

  async saveCourse(courseId: string, email: string): Promise<boolean> {
    try {
      await this.userRepo.update(
        { email: email },
        {
          $push: { enrolledCourses: courseId },
        }
      );
      const user = await this.userRepo.find({ email: email });
      const userId = user?.userId;
      await Course.updateOne(
        { courseId: courseId },
        {
          $push: {
            users: userId,
          },
        }
      );
      return true;
    } catch (error: any) {
      console.log(
        "Error in saving course data on user in user repo",
        error.message
      );
      throw new Error(error.message);
    }
  }
  async coursePaymentWallet(
    userId: string,
    amount: any,
    courseName: string
  ): Promise<any> {
    try {
      let wallet = await Wallet.findOne({ userId });
      const id = Math.floor(1000 + Math.random() * 9000).toString();
      const parsedAmount = typeof amount === "string" ? Number(amount) : amount;
      if (isNaN(parsedAmount)) {
        throw new Error("Invalid amount. Must be a valid number.");
      }
      const transaction = {
        transactionId: id,
        amount: parsedAmount,
        transactionType: "course payment" as "course payment",
        course: courseName,
        date: new Date(),
      };
      if (!wallet) {
        wallet = new Wallet({
          userId,
          balance: parsedAmount,
          transactions: [transaction],
        });
        await wallet.save();
      } else {
        wallet.balance += parsedAmount;
        wallet.transactions.push(transaction);
        await wallet.save();
      }
      return wallet;
    } catch (error: any) {
      console.error("Error in saving wallet in wallet repo", error.message);
      throw new Error(error.message);
    }
  }
  async ratings(courseId: string) : Promise<IRating[]> {
    try {
       return await Rating.find({ courseId }).lean();
    } catch (error: any) {
      console.error("Error in getting rating repo", error.message);
      throw new Error(error.message);
    }
  }
  async addRating(newRating: object): Promise<IRating> { 
    try {
      const rating = new Rating(newRating);
      const savedRating = await rating.save(); 
      return savedRating; 
    } catch (error: any) {
      console.error("Error in adding rating:", error.message);
      throw new Error(error.message);
    }
  }
}
export default AuthRepository;
