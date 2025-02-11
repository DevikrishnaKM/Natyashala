import mongoose, { Schema } from "mongoose";
import { IWishlist } from "../interfaces/common.inteface";

const wishlistSchema = new Schema<IWishlist>({
  userId: {
    type: String,
    ref: 'User',
    required: false,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
   
  },
  courseId: {
    type: String,
    ref: 'Course',
    required: true,
  },
  isWishlist: {
    type: Boolean,
    default: false, 
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Wishlist = mongoose.model<IWishlist>('Wishlist', wishlistSchema);
export default Wishlist;
