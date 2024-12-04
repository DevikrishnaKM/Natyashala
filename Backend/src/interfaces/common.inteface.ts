
import mongoose, { Document, Types } from 'mongoose'
export interface IUser extends Document {
    userId:string
    name: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword?: string;
    role: 'user' | 'tutor' | 'admin';
    isVerified: boolean;
    otp?: string;
    otpExpiration?: Date;
    resetPasswordOtp?: string;
    resetPasswordOtpExpiration?: Date;
    profilePicture?: string;
    enrolledCourses?: string[];
    walletBalance?: number;
    isApprovedTutor?: boolean;
    bio?: string;
    location?: string;
  }
  