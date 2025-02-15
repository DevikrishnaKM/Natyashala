import { Model } from "mongoose";
import userSchema from "../models/userSchema";
import BaseRepository from "./baseRepository";
import TutorApplication from "../models/applicationModel";
import {
  IUser,
  ITutorProfile,
  ICourseData,
  IVideo,
  ICourse,
  IMonthlyEnrollment,
  IMonthlyRevenue
} from "../interfaces/common.inteface";
import TutorProfile from "../models/tutorProfileModel";
import { Course, Section, Video } from "../models/courseModel";
import { Wallet } from "../models/walletModel";

class TutorRepository {
  private userRepo: BaseRepository<IUser>;
  private courseRepo: BaseRepository<ICourse>;

  constructor(userModel: Model<IUser>, courseModel: Model<ICourse>) {
    this.userRepo = new BaseRepository(userModel);
    this.courseRepo = new BaseRepository(courseModel);
  }
  async saveApplication(data: any): Promise<void> {
    try {
      console.log("final data before db application", data);
      const formattedData = {
        ...data,
        socialLinks:
          typeof data.socialLinks === "string"
            ? JSON.parse(data.socialLinks)
            : data.socialLinks,
      };
      const user = await userSchema.findOne({ email: data.email });
      if (!user) {
        throw new Error("User not found");
      }
      const updateData = {
        userId: user._id,
        bio: data.subjectsOfExpertise,
        education: data.degree,
        experience: data.experience,
        email: user.email,
        role: data.tutorRole,
      };
      const profileCreation = new TutorProfile(updateData);
      profileCreation.save();
      const tutorApplication = new TutorApplication(formattedData);
      await tutorApplication.save();
    } catch (error) {
      console.error("Error saving tutor application:", error);
      throw error;
    }
  }
  async editProfile(data: any): Promise<ITutorProfile> {
    try {
      const { email, values } = data;
      const user = await this.userRepo.find({ email: email });
      if (!user) {
        throw new Error("User not found");
      }
      const updateData = {
        userId: user._id,
        bio: values.bio,
        education: values.degree,
        country: values.country,
        language: values.language,
        experience: values.experience,
        email: email,
        role: values.role,
      };
      const updatedProfile = await TutorProfile.findOneAndUpdate(
        { userId: user._id },
        { $set: updateData },
        { new: true, upsert: true }
      );
      console.log("Profile updated or created:", updatedProfile);
      return updatedProfile;
    } catch (error: any) {
      console.error("Error editing tutor profile repo:", error);
      throw error;
    }
  }

  async saveCourse(data: ICourseData, email: string): Promise<boolean> {
    try {
      const videoFiles = data.files.filter(
        (file: { type: string }) => file.type === "video"
      );
      const thumbnail =
        data.files.find((file) => file.type === "thumbnail")?.url || "";
      const sections = await Promise.all(
        data.sections.map(async (sectionData, sectionIndex) => {
          const videos = await Promise.all(
            sectionData.videos.map(async (video, videoIndex) => {
              const videoDoc = new Video({
                title: video.name || `Video ${videoIndex + 1}`,
                description: sectionData.description,
                videoUrl: videoFiles[videoIndex]?.url || "",
              });
              await videoDoc.save();
              return videoDoc._id;
            })
          );
          const section = new Section({
            title: sectionData.name,
            description: sectionData.description,
            videos: videos,
          });
          await section.save();
          return section._id;
        })
      );
      const newCourse = new Course({
        courseId: data.courseId,
        email: email,
        name: data.courseName,
        description: data.description,
        price: data.price,
        sections: sections,
        tags: data.tags,
        language: data.language,
        thumbnail: thumbnail,
        category: data.selectedCategory,
      });
      await newCourse.save();
      return true;
    } catch (error: any) {
      console.error("Error creating course:", error);
      throw error;
    }
  }
  async getCoursesByTutor(email: string): Promise<ICourse[]> {
    try {
      return await Course.find({ email }, { isBlocked: false }).populate({
        path: "sections",
        populate: { path: "videos" },
      });
    } catch (error) {
      console.error("Error fetching courses:", error);
      throw error;
    }
  }

  async addVideo(
    name: string,
    description: string,
    newVideo: string,
    sectionId: string,
    courseId: string
  ): Promise<IVideo> {
    try {
      const video = new Video({
        title: name,
        description: description,
        videoUrl: newVideo,
      });
      const savedVideo = await video.save();
      const updatedSection = await Section.findByIdAndUpdate(
        sectionId,
        { $push: { videos: savedVideo._id } },
        { new: true, runValidators: true }
      );
      if (!updatedSection) {
        throw new Error("Section not found");
      }

      await Course.findOneAndUpdate(
        { courseId },
        { $addToSet: { sections: sectionId } },
        { new: true, runValidators: true }
      );
      return savedVideo;
    } catch (error: any) {
      console.log(
        "Error in getting montly revenue in tutor repo",
        error.message
      );
      throw new Error(error.message);
    }
  }
  async getTutorDetail(email : string) : Promise<ITutorProfile> {
    try {
      const tutor =  await TutorProfile.findOne({email : email}).lean().exec()
      if(!tutor) throw new Error("Cannot find Tutor")
      return tutor;
    } catch (error : any) {
      console.log("Error in getting tutro detail in tutor repo", error.message); 
      throw new Error(error.message);
    }
  }
  async getMonthlyUserEnrollments (year : number) : Promise<IMonthlyEnrollment[]> {
    try {
      const enrollments = await Course.aggregate([
        {$unwind : '$users'},
        {
          $match: {
            createdAt: {
              $gte: new Date(`${year}-01-01`),
              $lt: new Date(`${year + 1}-01-01`),
            },
          },
        },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' },
            },
            totalUsers: { $sum: 1 }, 
          },
        },
        {
          $sort: { '_id.month': 1 }, 
        },
      ]);

      return enrollments;

    } catch (error : any) {
      console.log("Error in getting montly users in tutor repo", error.message); 
      throw new Error(error.message);
    }
  }

   async getMonthlyRevenue (year: number) : Promise<IMonthlyRevenue[]> {
    try {
      const revenue = await Wallet.aggregate([
        {
          $unwind: '$transactions',
        },
        {
          $match: {
            'transactions.transactionType': 'course payment',
            'transactions.date': {
              $gte: new Date(`${year}-01-01`),
              $lt: new Date(`${year + 1}-01-01`),
            },
          },
        },
        {
          $group: {
            _id: {
              year: { $year: '$transactions.date' },
              month: { $month: '$transactions.date' },
            },
            totalRevenue: { $sum: '$transactions.amount' }, 
          },
        },
        {
          $sort: { '_id.month': 1 },
        },
      ]);
      return revenue;
    } catch (error : any) {
      console.log("Error in getting montly revenue in tutor repo", error.message); 
      throw new Error(error.message);
    }
  }
}
export default TutorRepository;
