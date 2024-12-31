import bcrypt from 'bcrypt';
import { IAuthRepository } from "../interfaces/auth.repository.interface";
import AppError from "../utils/appError";
import { v4 as uuidv4 } from "uuid";
import { generateOtp } from "../utils/generateOtp";
import sendEmail from "../utils/email";
import {ICleanedUser,IEditUser} from "../interfaces/common.inteface";
import {getOtpByEmail, otpSetData} from "../utils/redisCache";
import { createToken,createRefreshToken } from "../config/jwtConfig";
import HTTP_statusCode from '../Enums/httpStatusCode';
import { AwsConfig } from "../config/awsFileConfig";
import { S3Client } from "@aws-sdk/client-s3";
import { IAdminRepository } from '../interfaces/admin.repository.interface';

// interface FormData {
//   name:string,
//   email:string,
//   phone:string,
//   password:string,
//   otp:string,
// }

class AuthService {
  private authRepository: IAuthRepository;
  private adminRepository : IAdminRepository;

  aws = new AwsConfig()

  constructor(authRepository: IAuthRepository, adminRepository : IAdminRepository) {
    this.authRepository = authRepository,
    this.adminRepository = adminRepository
  }

  signUp = async (data: any, role: string): Promise<{ user: any; token: string }> => {
    if (!['user', 'tutor'].includes(role)) {
      throw new AppError('Invalid role: Only user, tutor allowed', HTTP_statusCode.BadRequest);
    }

    const existUser = await this.authRepository.findUser(data.email);
    if (existUser) {
      throw new AppError("Email already exists", HTTP_statusCode.BadRequest);
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const userId = uuidv4();
    const otp = generateOtp()

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
      subject: 'Welcome to Natyashala- The E-learning platform for arts !',
      message: `Your OTP is: ${otp}`,
    });

    const token = createToken(tempData.userId, tempData.role);
    return { user: tempData, token }; // Returning user and token
  };

  otpVerify = async (email: string, name: string, phone: string, password: string, inputOtp: string,role:'user'|'tutor'): Promise<Boolean> => {
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

        const userData = {  userId: uuidv4(),name, email, phone, password,role };
        await this.authRepository.createUser(userData);
        console.log("OTP matched successfully. Creating user...");
        return true
    } catch (error: any) {
        console.error("Error during OTP verification:", error.message);
        throw new AppError("Internal Server Error", HTTP_statusCode.InternalServerError);
    }
  };

  verifyLogin = async(email: string,password: string): Promise<{userInfo: ICleanedUser;accessToken: string; refreshToken: string;}> => {
    try {
      const userInfo  = await this.authRepository.validateLoginUser(email, password);
      // console.log(userInfo ,"userinfo")
      const accessToken = createToken(userInfo.userId as string, "user");
      const refreshToken = createRefreshToken(userInfo.userId as string, "user");
      return { userInfo, accessToken, refreshToken };
    } catch (error: any) {
      console.error("Error during login verification:", error.message);
      throw error;
    }
  }

  resendOtp = async(email: any): Promise<boolean> => {
    try {
      const otp = generateOtp()
      await otpSetData(email, otp);
      console.log("Resend generated OTP:", otp);
      return true;
    } catch (error: any) {
      console.error("Error during OTP resend:", error.message);
      throw error;
    }
  }
  editUser = async(userId : string ,updateData : object): Promise<IEditUser> => {
    try {
      const user = await this.authRepository.editUser(userId , updateData)
      const newData = {
        name : user?.name,
        phone :user?.phone,
        email : user?.email
      }
      return newData;
    } catch (error) {
      throw error;
    }
  }

  saveProfile = async(profile: Express.Multer.File, userId: string) : Promise<boolean> => {
    try {
      const profileUrl = await this.aws.uploadFileToS3(`users/profile/${userId}/`,profile);
      return await this.authRepository.saveProfile(userId as string,profileUrl as string);
    } catch (error: any) {
      console.error("Error in saving profile pic user serice :", error.message);
      throw error;
    }
  }
  getProfile = async(email: string) : Promise<string> => {
    try {
      const user = await this.authRepository.findUser(email)  
      let profileUrl = ""
       if(user?.profilePicture) {
        profileUrl = await this.aws.getfile(user?.profilePicture as string,`users/profile/${user?.userId}`);
       }
      return profileUrl;
    } catch (error: any) {
        console.error("Error in getting profile pic user serice :",error.message);
      throw error;
    }
  }

}

export default AuthService;
