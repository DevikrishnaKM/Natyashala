import mongoose, {  Schema, model } from 'mongoose';
import Validator from 'validator';
import bcrypt from 'bcrypt';
import {IUser} from "../interfaces/common.inteface";

// Create the User schema
const userSchema = new Schema<IUser>(
  {
    userId: { type: String, required: true, unique: true },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      validate: {
        validator: (value: string) => Validator.isEmail(value),
        message: 'Please enter a valid email address',
      },
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      unique: true,
      validate: {
        validator: (value: string) => Validator.isMobilePhone(value, 'en-IN'),
        message: 'Please enter a valid phone number',
      },
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 8,
    },
    confirmPassword: {
      type: String,
      // required: [true, 'Confirm password is required'],
      // validate: {
      //   validator: function (this: IUser, value: string) {
      //     return value === this.password;
      //   },
      //   message: 'Passwords do not match',
      // },
    },
    role: {
      type: String,
      enum: ['user', 'tutor'],
      // default: 'user',
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    otp: {
      type: String,
      default: null,
    },
    otpExpiration: {
      type: Date,
      default: null,
    },
    resetPasswordOtp: {
      type: String,
      default: null,
    },
    resetPasswordOtpExpiration: {
      type: Date,
      default: null,
    },
    profilePicture: {
      type: String,
      default: 'default.jpg',
    },
    enrolledCourses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
      },
    ],
    walletBalance: {
      type: Number,
      default: 0,
    },
    isApprovedTutor: {
      type: Boolean,
      default: false,
    },
    bio: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook
userSchema.pre('save', async function (next) {
  const user = this as IUser;

  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 10);
  }

  user.confirmPassword = undefined; // Do not save confirmPassword to DB
  next();
});

// Create the User model
const User = model<IUser>('User', userSchema);

export default User;
