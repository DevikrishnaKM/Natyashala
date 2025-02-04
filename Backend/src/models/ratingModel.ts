import mongoose, { Schema, Types } from "mongoose";
import { IRating } from "../interfaces/common.inteface";


const ratingSchema = new Schema<IRating>({
  courseId: {
    type: String,
    ref: 'Course',
    required: true,
  },
  userId: {
    type: String,
    ref: 'User',
    required: true,
  },
  ratingValue: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  review: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Rating = mongoose.model<IRating>('Rating', ratingSchema);
export default Rating;