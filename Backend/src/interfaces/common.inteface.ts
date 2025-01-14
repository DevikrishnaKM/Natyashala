
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
    profilePicture?: string;
    enrolledCourses?: string[];
    walletBalance?: number;
    isApprovedTutor?: boolean;
    tutorCredentials?: {
      email?: string;
      passwordHash?: string;
    };
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
  name:string
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
  
export interface ICategory extends Document {
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}


export interface IVideo  extends Document {
  title: string;
  description?: string;
  videoUrl: string;
}

export interface ISection  extends Document {
  title: string;
  description?: string;
  videos: Types.ObjectId[]; 
}
export interface ICourse extends Document  {
  courseId: string;
  email: string;
  name: string;
  description: string;
  price : number | string;
  category: string;
  sections: Types.ObjectId[]; 
  tags: string[];
  language: string;
  ratings?: Types.ObjectId[]; 
  comments?: Types.ObjectId[];
  thumbnail?: string;
  isBlocked : boolean;
  createdAt : Date;
  users ?: [];
  averageRating ?: number ;
  totalRatings ?: number;
}

export interface ICourseData {
  courseId: string;
  courseName: string;
  description: string;
  language: string;
  tags: string[];
  selectedCategory: string;
  sections: {
    name: string;
    description: string;
    videos: {
      name : string;
      description: string;
      title: string;
      videoUrl: string;
    }[];
  }[];
  additionalDetail1: string;
  price: string;
  files: { type: string; url: string }[];
}