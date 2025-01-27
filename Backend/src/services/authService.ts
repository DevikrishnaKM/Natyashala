import bcrypt from "bcrypt";
import { IAuthRepository } from "../interfaces/auth.repository.interface";
import AppError from "../utils/appError";
import { v4 as uuidv4 } from "uuid";
import { generateOtp } from "../utils/generateOtp";
import sendEmail from "../utils/email";
import { ICleanedUser, IEditUser,ICourse } from "../interfaces/common.inteface";
import { getOtpByEmail, otpSetData } from "../utils/redisCache";
import { createToken, createRefreshToken } from "../config/jwtConfig";
import HTTP_statusCode from "../Enums/httpStatusCode";
import { AwsConfig } from "../config/awsFileConfig";
import { IAdminRepository } from "../interfaces/admin.repository.interface";
import ICourseRepository from "../interfaces/course.repository.interface";
import { createUniquePass } from "../helper/tutorCredentials";
import makeThePayment from "../config/stripeConfig";


class AuthService {
  private authRepository: IAuthRepository;
  private adminRepository: IAdminRepository;
  private courseRepository: ICourseRepository;

  aws = new AwsConfig();

  constructor(
    authRepository: IAuthRepository,
    adminRepository: IAdminRepository,
    courseRepository: ICourseRepository
  ) {
    this.authRepository = authRepository;
    this.adminRepository = adminRepository;
    this.courseRepository = courseRepository;
  }

  signUp = async (
    data: any,
    role: string
  ): Promise<{ user: any; token: string }> => {
    if (!["user", "tutor"].includes(role)) {
      throw new AppError(
        "Invalid role: Only user, tutor allowed",
        HTTP_statusCode.BadRequest
      );
    }

    const existUser = await this.authRepository.findUser(data.email);
    if (existUser) {
      throw new AppError("Email already exists", HTTP_statusCode.BadRequest);
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const userId = uuidv4();
    const otp = generateOtp();

    const tempData = {
      userId,
      name: data.name,
      email: data.email,
      phone: data.phone,
      password: hashedPassword,
      otp,
      otpExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      createdAt: new Date(),
      role,
      isVerified: false,
    };

    await otpSetData(data.email, otp);

    await sendEmail({
      email: tempData.email,
      subject: "Welcome to Natyashala- The E-learning platform for arts !",
      message: `Your OTP is: ${otp}`,
    });

    const token = createToken(tempData.userId, tempData.role);
    return { user: tempData, token }; // Returning user and token
  };

  otpVerify = async (
    email: string,
    name: string,
    phone: string,
    password: string,
    inputOtp: string,
    role: "user" | "tutor"
  ): Promise<Boolean> => {
    try {
      const storedOtp = await getOtpByEmail(email);
      console.log("storedOtp:", storedOtp, inputOtp);

      if (!storedOtp) {
        throw new AppError("OTP not found", HTTP_statusCode.NotFound);
      }

      if (storedOtp !== inputOtp) {
        console.log("otp mismatch:", storedOtp, inputOtp);
        throw new AppError("Wrong OTP", HTTP_statusCode.Conflict);
      }

      const userData = { userId: uuidv4(), name, email, phone, password, role };
      await this.authRepository.createUser(userData);
      console.log("OTP matched successfully. Creating user...");
      return true;
    } catch (error: any) {
      console.error("Error during OTP verification:", error.message);
      throw new AppError(
        "Internal Server Error",
        HTTP_statusCode.InternalServerError
      );
    }
  };

  verifyLogin = async (
    email: string,
    password: string
  ): Promise<{
    userInfo: ICleanedUser;
    accessToken: string;
    refreshToken: string;
  }> => {
    try {
      const userInfo = await this.authRepository.validateLoginUser(
        email,
        password
      );
      // console.log(userInfo ,"userinfo")
      const accessToken = createToken(userInfo.userId as string, "user");
      const refreshToken = createRefreshToken(
        userInfo.userId as string,
        "user"
      );
      return { userInfo, accessToken, refreshToken };
    } catch (error: any) {
      console.error("Error during login verification:", error.message);
      throw error;
    }
  };

  resendOtp = async (email: any): Promise<boolean> => {
    try {
      const otp = generateOtp();
      await otpSetData(email, otp);
      console.log("Resend generated OTP:", otp);
      return true;
    } catch (error: any) {
      console.error("Error during OTP resend:", error.message);
      throw error;
    }
  };
  editUser = async (userId: string, updateData: object): Promise<IEditUser> => {
    try {
      const user = await this.authRepository.editUser(userId, updateData);
      const newData = {
        name: user?.name,
        phone: user?.phone,
        email: user?.email,
      };
      return newData;
    } catch (error) {
      throw error;
    }
  };


  saveProfile = async (
    profile: Express.Multer.File,
    userId: string
  ): Promise<boolean> => {
    try {
      const profileUrl = await this.aws.uploadFileToS3(
        `users/profile/${userId}/`,
        profile
      );

      console.log("Profile URL:", profileUrl);

      const result = await this.authRepository.saveProfile(userId, profileUrl);

      return result;
    } catch (error: any) {
      console.error("Error in saveProfile service:", error.message);
      throw error;
    }
  };

  getProfile = async (email: string): Promise<string> => {
    try {
      const user = await this.authRepository.findUser(email);
      // console.log("user in aervice:",user)
      let profileUrl = "";
      if (user?.profilePicture) {
        // Extract only the file name from the full path
        const fileName = user.profilePicture.split("/").pop(); // Extract the file name
        const folder = `users/profile/${user?.userId}`; // Construct the folder path
        profileUrl = await this.aws.getfile(fileName as string, folder);
      }

      //  console.log(profileUrl,"in authService")
      return profileUrl;
    } catch (error: any) {
      console.error(
        "Error in getting profile pic user serice :",
        error.message
      );
      throw error;
    }
  };
  getCourses = async(category: string , page: number, limit: number , filter?: string) : Promise<{ courses: any, totalPages : number}> => {
    try {
      const response = await this.authRepository.getCourses(category, page, limit);
      const coursesWithUrls = await Promise.all(
        response.courses.map(async (course: any) => {
          const thumbnails = course.thumbnail
            ? await this.aws.tutorGetfile(course.thumbnail,`tutors/${course.email}/courses/${course.courseId}/thumbnail`)
            : null;
          return { ...course, thumbnail: thumbnails };
        })
      );
      return {
        courses: coursesWithUrls,
        totalPages: response.totalPages,
      };
    } catch (error) {
      throw error;
    }
  }

  getCourseDetail = async(id: string) : Promise<any> => {
    try {
      const response = await this.authRepository.courseDetails(id)
      const tutor = await this.authRepository.findUser(response?.email)
      const thumbnailUrl = await this.aws.tutorGetfile(
        response?.thumbnail as string,
        `tutors/${response.email}/courses/${response.courseId}/thumbnail`
      );
       let profileUrl =''
      if(tutor?.profilePicture) {
         profileUrl = await this.aws.tutorGetfile(tutor?.profilePicture as string,`users/profile/${tutor?.userId}` )
      }
      const sectionsWithUrls = await Promise.all(
        response.sections.map(async (section: any, index: number) => {
          const videosWithUrls = await Promise.all(
            section.videos.map(async (video: any) => {
              console.log(video.videoUrl, "vurl");

              const videoUrl = await this.aws.tutorGetfile(
                video.videoUrl,
                `tutors/${response.email}/courses/${response.courseId}/videos`
              );
              return { ...video.toObject(), url: videoUrl };
            })
          );
          return { ...section.toObject(), videos: videosWithUrls };
        })
      );

      return {
        ...response,
        thumbnailUrl,
        sections: sectionsWithUrls,
        profileUrl
      };
    } catch (error: any) {
      console.error("Error fetching course details:", error.message);
      throw new Error(`Failed to fetch course details: ${error.message}`);
    }
  }
  checkEnrollment = async(courseId: string, email: string) : Promise<boolean> =>{
    try {
      const user = await this.authRepository.findUser(email as string);
      if (user?.enrolledCourses) {
        const isEnrolled = (user.enrolledCourses as string[]).includes(courseId);
        console.log("enrollled", isEnrolled, courseId);
        return isEnrolled;
      }
      return false;
    } catch (error: any) {
      console.error(
        "Error in checkin enrollment in user serice :",
        error.message
      );
      throw new Error(` ${error.message}`);
    }
  }
  createSession = async (
    amount: number,
    email: string,
    courseId: string,
    courseName: string
  ): Promise<any> => {
    try {
      const data = {
        amount,
        email,
        courseId,
        courseName,
      }
      const user = await this.authRepository.findUser(email);
      if(!user){
        throw new Error("user is not there")
      }
      const course = await this.authRepository.getCourse(courseId);
      if(!course){
        throw new Error("course is not there")
      }
      const orderId = createUniquePass(10)
      const orderDetails = {
        userId: user?.userId || "", 
        courseId: courseId,
        totalAmount: amount,
        orderId: orderId,
        courseName:courseName,
        paymentStatus: "Pending",
      };
      await this.authRepository.saveOder(orderDetails);
      const session = await makeThePayment(data,orderId as string)
      if(session){
        const update = await this.authRepository.updateOrder(session.id,orderId as string)
        console.log("session:",session)
        console.log("updateOrder:",update)
        return session
      }
    
     
    } catch (error: any) {
      console.error('Error in create session:', error.message);
      throw new Error(`Error processing payment: ${error.message}`);
    }
  };

  confirmCourse = async(orderId:string):Promise<any> =>{
    try {
      const orderStatus = await this.authRepository.confirmOrder(orderId)
      console.log("status changed:",orderStatus)
      return orderStatus
    } catch (error:any) {
      console.error('Error in confirm course:', error.message);
      throw new Error(`Error confim course...: ${error.message}`);
    }
  }
  
}

export default AuthService;
