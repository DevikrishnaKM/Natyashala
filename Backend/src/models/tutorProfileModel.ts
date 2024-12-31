
import mongoose, { Document, Schema } from 'mongoose';
import { ITutorProfile } from '../interfaces/common.inteface';



const TutorProfileSchema: Schema = new Schema<ITutorProfile>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  email: {type: String, required: true},
  role: {type: String, required: true},
  country : {type :String},
  language : {type :String},
  profilePhotoUrl: { type: String},
  bio: { type: String, required: true },
  education: {type: String, required: true},
  experience: {type : String },
  socialLinks: {
    youtube: { type: String },
    instagram: { type: String },
    linkedin: { type: String },
    twitter: { type: String },
  },
  certifications: [
    {
      title: { type: String, required: true },
      issuer: { type: String, required: true },
      date: { type: Date, required: true },
      certificateUrl: { type: String, required: true },
    },
  ],
}, {
  timestamps: true,
});

const TutorProfile = mongoose.model<ITutorProfile>('TutorProfile', TutorProfileSchema);

export default TutorProfile;
