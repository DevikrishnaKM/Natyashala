
import mongoose, { Document, Types } from 'mongoose'
export interface IUser extends Document {
    userId:string
    name: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword?: string;
    role: 'user' | 'tutor' ;
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
    createdAt?: Date;
    updatedAt?: Date;
  }
 export interface ICleanedUser {
    userId : string
    name: string;
    email: string;
    phone: string;
    role: 'user' | 'tutor' | 'admin';
    isVerified: boolean;
    profilePicture : string | "";
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IEditUser  {
  name: string | undefined; 
  phone: string | undefined;
}


export interface FileUrl extends Document{
  type: string;
  url: string;
  signedUrl?: string; 
}

export interface ITutorApplication extends Document{
  applicationId:string
  email:string
  tutorRole:string
  age:string
  birthday:Date
  gender:string
  phone:string
  degree:string
  fieldOfStudy:string
  institution:string
  graduationYear:string
  teachingExperience:string
  subjectsOfExpertise:string
  socialLinks:Map<string,string>
  files:FileUrl[]
  status:"pending"|"accepted"|"rejected"
}
export interface ITutorProfile extends Document  {
  userId: mongoose.Types.ObjectId; 
  email : string;
  profilePhotoUrl ?: string;
  role : string;
  country ?: string;
  language ?: String;
  bio: string;
  education : string;
  experience: string;
  socialLinks ?: {
    youtube?: string;
    instagram?: string;
    linkedin?: string;
    twitter?: string;
  };
  certifications?: {
    title: string;
    issuer: string;
    date: Date;
    certificateUrl: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}
  