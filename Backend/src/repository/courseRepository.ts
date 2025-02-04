import mongoose, { Types } from "mongoose";
import { Course, ICourse, IVideo, Section, Video } from "../models/courseModel";
import TutorProfile from "../models/tutorProfileModel";
import ICourseRepository from "../interfaces/course.repository.interface";

export class CourseRepository implements ICourseRepository {

  async getUserCourses(userId: string) : Promise<ICourse[]> {
    try {
      
      const courses = await Course.find().populate({
        path: "sections",
        populate: { path: "videos" },
      }).lean();
      console.log("cours:",courses)
      if (!courses) {
        throw new Error("Cannot find course.");
      }
      return courses;
    } catch (error: any) {
      console.log("Error in getting course detail course repo", error.message);
      throw new Error(error.message);
    }
  }

  async updateCourse(couresId: string, newData: any): Promise<ICourse> {
    try {
      console.log("course", couresId, newData);

      const updated = await Course.findOneAndUpdate(
        { courseId: couresId },
        {
          $set: {
            ...newData,
          },
        },
        { new: true, upsert: true }
      );
      return updated;
    } catch (error: any) {
      console.log("Error in updating course detail course repo", error.message);
      throw new Error(error.message);
    }
  }
  async updateVid(_id : string, title : string , description : string) : Promise<IVideo> {
    try {
      const newData = {
        title ,
        description
      } 
      const updated = await Video.findOneAndUpdate(
        { _id: _id },
        {
          $set: {
            ...newData,
          },
        },
        { new: true, upsert: true }
      );
      return updated;
    } catch (error: any) {
      console.log("Error in updating course detail course repo", error.message);
      throw new Error(error.message);
    }
  }

   async deleteVideo(videoId: string, courseId: string) : Promise<boolean | null> {
    try {
      return await Video.findByIdAndDelete(videoId);
    } catch (error: any) {
      console.log('Error in deleting video from course repo', error.message);
      throw new Error(error.message);
    }
  } 
}
