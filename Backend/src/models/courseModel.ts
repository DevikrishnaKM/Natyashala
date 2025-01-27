import mongoose, { Schema, Types, Document } from "mongoose";
import { ICourse, ISection, IVideo } from "../interfaces/common.inteface";

const videoSchema = new Schema<IVideo>({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  videoUrl: {
    type: String,
    required: true,
  },
});

const sectionSchema = new Schema<ISection>({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  videos: [{ type: Schema.Types.ObjectId, ref: "Video" }],
});

const courseSchema = new Schema<ICourse>({
  courseId: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Schema.Types.Mixed,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  sections: [{ type: Schema.Types.ObjectId, ref: "Section" }],
  tags: [String],
  language: {
    type: String,
    required: true,
  },
  ratings: [{ type: Schema.Types.ObjectId, ref: "Rating" }],
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  thumbnail: {
    type: String,
  },
  isBlocked: {
    type: Boolean,
    default: false,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  users: {
    type: [String],
    default: [],
  },
  averageRating: {
    type: Number,
    default: 0,
    required:false
  },
  totalRatings: {
    type: Number,
    default: 0,
    required:false
  },
},{
  timestamps :true
});

const Course = mongoose.model<ICourse>("Course", courseSchema);
const Section = mongoose.model<ISection>("Section", sectionSchema);
const Video = mongoose.model<IVideo>("Video", videoSchema);

export { Course, Section, Video, ICourse, ISection, IVideo };
