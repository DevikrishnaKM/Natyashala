import { IAdminServices } from "../interfaces/admin.service.interface";
import { IAdminRepository } from "../interfaces/admin.repository.interface";
import { createRefreshToken, createToken } from "../config/jwtConfig";
import {
  ICleanedUser,
  ITutorApplication,
  FileUrl,
  ICategory,
  ICourse,
  IUser,
  IReport,
  IReportData,
  IUserAggregationResult,
} from "../interfaces/common.inteface";
import { AwsConfig } from "../config/awsFileConfig";
import getFolderPathByFileType from "../helper/filePathHandler";
import { IAuthRepository } from "../interfaces/auth.repository.interface";
import { createUniquePass } from "../helper/tutorCredentials";
import sendTutorLoginCredentials, {
  sendTutorRejectionMail,
} from "../helper/tutorMail";
import { v4 as uuidv4 } from 'uuid';


const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD;

class AdminServices implements IAdminServices {
  private adminRepository: IAdminRepository;
  private authRepository: IAuthRepository;

  constructor(
    adminRepository: IAdminRepository,
    authRepository: IAuthRepository
  ) {
    this.adminRepository = adminRepository;
    this.authRepository = authRepository;
  }
  aws = new AwsConfig();
  login = (
    email: string,
    password: string
  ): { adminAccessToken: string; adminRefreshToken: string } => {
    try {
      if (email !== adminEmail) {
        throw new Error("Invalid Email");
      } else if (password !== adminPassword) {
        throw new Error("Invalid Password");
      }
      const adminAccessToken: string = createToken(email as string, "Admin");
      const adminRefreshToken: string = createRefreshToken(
        email as string,
        "Admin"
      );
      return { adminAccessToken, adminRefreshToken };
    } catch (error: any) {
      console.error("Error during admin login services:", error.message);
      throw error;
    }
  };
  getUsersList = async (
    page: number,
    limit: number
  ): Promise<{ users: ICleanedUser[]; total: number }> => {
    try {
      if (typeof page !== "number" || page < 1) {
        throw new Error("Invalid page number");
      }
      if (typeof limit !== "number" || limit < 1) {
        throw new Error("Invalid limit value");
      }

      // Fetch users and total count from the repository
      const { users, total } = await this.adminRepository.getUsers(page, limit);

      // Filter for role "user" and map the data
      const cleanedUsers: ICleanedUser[] = users
        .filter((user: any) => user._doc.role === "user") // Filter by role
        .map((user: any) => {
          const {
            userId,
            name,
            email,
            phone,
            isVerified,
            role,
            profilePicture,
            createdAt,
          } = user._doc;
          return {
            userId,
            name,
            email,
            phone,
            role,
            isVerified,
            profilePicture,
            createdAt,
          };
        });

      return { users: cleanedUsers, total };
    } catch (error: any) {
      console.error(
        "Error during admin getting users services:",
        error.message
      );
      throw error;
    }
  };
  blockUser = async (email: string): Promise<boolean> => {
    try {
      return await this.adminRepository.blockUser(email);
    } catch (error: any) {
      console.error(
        "Error during admin blocking user in  services:",
        error.message
      );
      throw error;
    }
  };

  unBlockUser = async (email: string): Promise<boolean> => {
    try {
      return await this.adminRepository.unBlockUser(email);
    } catch (error: any) {
      console.error(
        "Error during admin blocking user in  services:",
        error.message
      );
      throw error;
    }
  };

  getApplications = async (): Promise<ITutorApplication[]> => {
    try {
      const result = await this.adminRepository.getApplications();
      console.log("result od appli:", result);
      return result;
    } catch (error: any) {
      console.error(
        "Error during admin getting  applications in  services:",
        error.message
      );
      throw error;
    }
  };

  findApplication = async (id: string): Promise<ITutorApplication> => {
    try {
      const response = await this.adminRepository.findApplication(id);
      if (!response) {
        throw new Error("Application not found");
      }
      if (response.files) {
        const signedFiles = await Promise.all(
          response.files.map(async (file: { type: string; url: string }) => {
            const [uniqueName, ...rest] = file.url.split("-");
            const folderPath = getFolderPathByFileType(file.type);
            const signedUrl = await this.aws.tutorGetfile(file.url, folderPath);
            return { signedUrl, ...file };
          })
        );
        response.files = signedFiles as FileUrl[];
      }
      return response;
    } catch (error: any) {
      console.error(
        "Error during admin getting one applicant services:",
        error.message
      );
      throw error;
    }
  };

  acceptApplication = async (id: string): Promise<boolean> => {
    try {
      const application = await this.adminRepository.findApplication(id);
      const status = await this.adminRepository.changeStatus(id);
      console.log("status:", status);
      const user = await this.authRepository.findUser(
        application?.email as string
      );
      if (!user) throw new Error("User doesnt exist.");
      const uniquePass = createUniquePass(6);
      const updateUser = await this.adminRepository.addTutorCredential(
        user.email as string,
        uniquePass as any
      );
      await sendTutorLoginCredentials(user.email as string, uniquePass as any);
      return updateUser;
    } catch (error: any) {
      console.error(
        "Error during admin accepting  applicant services:",
        error.message
      );
      throw error;
    }
  };

  rejectApplication = async (id: string): Promise<any> => {
    try {
      const application = await this.adminRepository.findApplication(id);
      const status = await this.adminRepository.updateStatus(id);
      console.log("status:", status);
      const user = await this.authRepository.findUser(
        application?.email as string
      );
      if (!user) throw new Error("User doesnt exist.");
      await sendTutorRejectionMail(user.email as string, user.name as string);
      return user;
    } catch (error: any) {
      console.error(
        "Error during admin rejecting  applicant services:",
        error.message
      );
      throw error;
    }
  };

  checkTutorStatus = async (email: string): Promise<boolean | undefined> => {
    try {
      const response = await this.authRepository.findUser(email);
      console.log("res in ser", response);
      return response?.isApprovedTutor;
    } catch (error: any) {
      console.error("Error during admin checking tutor status:", error.message);
      throw error;
    }
  };

  getTutors = async (
    page: number,
    limit: number
  ): Promise<{ tutors: ICleanedUser[]; total: number }> => {
    try {
      if (typeof page !== "number" || page < 1) {
        throw new Error("Invalid page number");
      }
      if (typeof limit !== "number" || limit < 1) {
        throw new Error("Invalid limit value");
      }
      const { tutors, total } = await this.adminRepository.getTutors(
        page,
        limit
      );

      const cleanedUsers = await Promise.all(
        tutors.map(async (user: any) => {
          const {
            name,
            email,
            phone,
            createdAt,
            role,
            isVerified,
            profilePicture,
            userId,
            isApprovedTutor,
          } = user._doc;

          const profileUrl = profilePicture
            ? await this.aws.tutorGetfile(
                profilePicture as string,
                `users/profile/${userId}`
              )
            : "";

          return {
            name,
            email,
            phone,
            role,
            isVerified,
            profilePicture: profileUrl,
            createdAt: createdAt.toISOString().slice(0, 10),
            userId,
            isApprovedTutor,
          };
        })
      );

      console.log("Cleaned user data", cleanedUsers);

      return { tutors: cleanedUsers, total };
    } catch (error: any) {
      console.error(
        "Error during admin getting users services:",
        error.message
      );
      throw error;
    }
  };

  createCategory = async (
    categoryName: string,
    description: string
  ): Promise<boolean> => {
    try {
      return await this.adminRepository.createCategory(
        categoryName as string,
        description as string
      );
    } catch (error: any) {
      console.error(
        "Error during admin creating category in service:",
        error.message
      );
      throw error;
    }
  };

  getCategories = async (): Promise<ICategory[]> => {
    try {
      return await this.adminRepository.getCategories();
    } catch (error: any) {
      console.error(
        "Error during admin getting categories in service:",
        error.message
      );
      throw error;
    }
  };

  getCourses = async (
    page: number,
    limit: number
  ): Promise<{ courses: any; totalCourses: number }> => {
    try {
      const skip = (page - 1) * limit;
      const response = await this.adminRepository.getCourses(skip, limit);

      const coursesWithUrls = await Promise.all(
        response.courses.map(async (course: any) => {
          const thumbnails = course.thumbnail
            ? await this.aws.tutorGetfile(
                course.thumbnail,
                `tutors/${course.email}/courses/${course.courseId}/thumbnail`
              )
            : null;
          return {
            _id: course._doc._id,
            courseId: course._doc.courseId,
            email: course._doc.email,
            name: course._doc.name,
            description: course._doc.description,
            price: course._doc.price,
            category: course._doc.category,
            sections: course._doc.sections,
            tags: course._doc.tags,
            language: course._doc.language,
            ratings: course._doc.ratings,
            comments: course._doc.comments,
            thumbnail: thumbnails,
            isBlocked: course._doc.isBlocked,
            isVerified: course._doc.isVerified,
            users: course._doc.users,
            averageRating: course._doc.averageRating,
            totalRatings: course._doc.totalRatings,
            createdAt: course._doc.createdAt,
          };
        })
      );
      return {
        courses: coursesWithUrls,
        totalCourses: response.totalCourses,
      };
    } catch (error: any) {
      console.error(
        "Error during admin getting course detail in service:",
        error.message
      );
      throw error;
    }
  };
  blockCourse = async (courseId: string): Promise<string> => {
    try {
      return await this.adminRepository.blockCourse(courseId);
    } catch (error: any) {
      console.error("Error during blocking course  in service:", error.message);
      throw error;
    }
  };

  unBlockCourse = async (courseId: string): Promise<string> => {
    try {
      return await this.adminRepository.unBlockCourse(courseId);
    } catch (error: any) {
      console.error(
        "Error during unblocking course  in service",
        error.message
      );
      throw error;
    }
  };

  findCourse = async (id: string): Promise<any> => {
    try {
      const response = await this.adminRepository.findCourse(id);
      console.log("RES:", response);

      return response;
    } catch (error: any) {
      console.error(
        "Error during admin finding course detail in service:",
        error.message
      );
      throw error;
    }
  };

  acceptCourse = async (id: string): Promise<boolean> => {
    try {
      const Course = await this.adminRepository.acceptCourse(id);

      console.log("course:", Course);

      return Course;
    } catch (error: any) {
      console.error(
        "Error during admin accepting  applicant services:",
        error.message
      );
      throw error;
    }
  };
  getTopTutors = async (): Promise<IUser[]> => {
    try {
      const tutors = await this.adminRepository.getTopTutors();
      const updatedProfiles = await Promise.all(
        tutors.map(async (tutor: IUser) => {
          const profileUrl = tutor.profilePicture
            ? await this.aws.tutorGetfile(
                tutor.profilePicture,
                `users/profile/${tutor.userId}`
              )
            : "";
          return {
            ...tutor,
            profile: profileUrl,
          };
        })
      );
      return updatedProfiles;
    } catch (error: any) {
      console.error(
        "Error during admin getting course detail in service:",
        error.message
      );
      throw error;
    }
  };

  getTopCourses = async (): Promise<ICourse[]> => {
    try {
      const topCourses = await this.adminRepository.getTopCourses();
      const withThumbnail = await Promise.all(
        topCourses.map(async (course: any) => {
          const thumbnailUrl = await this.aws.tutorGetfile(
            course?.thumbnail,
            `tutors/${course.email}/courses/${course.courseId}/thumbnail`
          );
          const profileUrl = course.userDetails?.profilePicture
            ? await this.aws.tutorGetfile(
                course?.userDetails?.profilePicture,
                `users/profile/${course?.userDetails?.userId}`
              )
            : "";
          return {
            ...course,
            thumbnail: thumbnailUrl,
            profile: profileUrl,
          };
        })
      );
      return withThumbnail;
    } catch (error: any) {
      console.error(
        "Error during admin getting course detail in service:",
        error.message
      );
      throw error;
    }
  };
  getDashboard = async (): Promise<{
    dashboard: { users: number; courses: number; tutors: number };
    barGraphData: IUserAggregationResult[];
  }> => {
    try {
      const dashboard = await this.adminRepository.getDasboard();
      const barGraphData =
        await this.adminRepository.getUserAndTutorStatsByMonth();
      console.log("Bargraph data", barGraphData);
      return { dashboard, barGraphData };
    } catch (error: any) {
      console.error(
        "Error during admin getting course detail in service:",
        error.message
      );
      throw error;
    }
  };
  getReports = async (
    page: number,
    limit: number
  ): Promise<{ reports: IReport[]; totalPages: number }> => {
    try {
      const skip = (page - 1) * limit;
      console.log(limit, skip);

      const reports = await this.adminRepository.getReports(skip, limit);
      const totalReports = await this.adminRepository.countReports();
      const totalPages = Math.ceil(totalReports / limit);
      return { reports, totalPages };
    } catch (error: any) {
      console.error(
        "Error during admin getting reports in service:",
        error.message
      );
      throw error;
    }
  };
  reportDetail = async (reportId: string): Promise<IReportData> => {
    try {
      const report = await this.adminRepository.reportDetail(reportId);
      const course = await this.authRepository.getCourse(report.courseId);
      const thumbnailUrl = await this.aws.tutorGetfile(
        course?.thumbnail as string,
        `tutors/${course.email}/courses/${course.courseId}/thumbnail`
      );
      const user = await this.authRepository.findUser(course?.email);
      if (!user) {
        throw new Error("Cannot find user/tutor.");
      }
      const reportData: IReportData = {
        thumbnailUrl: thumbnailUrl,
        tutorName: user.name,
        courseName: course.name,
        courseDescription: course.description,
        tutorEmail: course.email,
        users: course?.users,
        report,
      };
      return reportData;
    } catch (error: any) {
      console.error(
        "Error during admin getting report detail in service:",
        error.message
      );
      throw error;
    }
  };
  reportCourse = async(courseId: string  , reason: string , additionalInfo: string) : Promise<boolean> => {
    try {
        const {name , email } = await this.authRepository.getCourse(courseId)
        const user = await this.authRepository.findUser(email)
        const tutorName =  user?.name
        const reportId = uuidv4()
        const reportData = {
          courseId,
          reason,
          additionalInfo,
          tutorName,
          courseName : name,
          reportId
        }
        return await this.adminRepository.saveReport(reportData)
    } catch (error : any) {
        console.error("Error during admin saving report in service:", error.message);
        throw error;
    }
}

}
export default AdminServices;

