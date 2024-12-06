import bcrypt from 'bcrypt';
import { IAuthRepository } from "../interfaces/auth.repository.interface";
import AppError from "../utils/appError";
import { v4 as uuidv4 } from "uuid";
import { generateOtp } from "../utils/generateOtp";
import sendEmail from "../utils/email";
import {getOtpByEmail, otpSetData} from "../utils/redisCache";
import { createToken } from "../config/jwtConfig";
import HTTP_statusCode from '../Enums/httpStatusCode';

class AuthService {
  private authRepository: IAuthRepository;

  constructor(authRepository: IAuthRepository) {
    this.authRepository = authRepository;
  }

  signUp = async (data: any, role: string): Promise<{ user: any; token: string }> => {
    if (!['user', 'tutor'].includes(role)) {
      throw new AppError('Invalid role: Only user, admin allowed', HTTP_statusCode.BadRequest);
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
    const storedOtp = await getOtpByEmail(data.email)
    console.log(`storedOtp:${storedOtp}`)

    await sendEmail({
      email: tempData.email,
      subject: 'Welcome!',
      message: `Your OTP is: ${otp}`,
    });

    const token = createToken(tempData.userId, tempData.role);
    return { user: tempData, token }; // Returning user and token
  };
}

export default AuthService;
