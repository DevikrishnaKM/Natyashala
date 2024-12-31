import { Model } from "mongoose";
import userSchema from "../models/userSchema"
import BaseRepository from "./baseRepository";
import TutorApplication from "../models/applicationModel";
import { IUser, ITutorProfile } from "../interfaces/common.inteface";
import TutorProfile from "../models/tutorProfileModel";

class TutorRepository{
    private userRepo : BaseRepository<IUser>;

    constructor(
        userModel : Model<IUser>
    ){
        this.userRepo = new BaseRepository(userModel)
    }
    async saveApplication(data: any): Promise<void> {
        try {
          console.log("final data before db application", data);
          const formattedData = {
            ...data,
            socialLinks: typeof data.socialLinks === 'string' ? JSON.parse(data.socialLinks) : data.socialLinks
          };
          const user = await userSchema.findOne({email : data.email})
          if (!user) {
            throw new Error('User not found');
          }
          const updateData = {
            userId: user._id, 
            bio: data.subjectsOfExpertise,
            education: data.degree, 
            experience: data.experience,
            email : user.email,
            role : data.tutorRole
          };
          const profileCreation =  new TutorProfile(updateData)
          profileCreation.save()
          const tutorApplication = new TutorApplication(formattedData);
          await tutorApplication.save();
        } catch (error) {
          console.error("Error saving tutor application:", error);
          throw error;
        }
      }
      async editProfile(data : any) : Promise<ITutorProfile> {
        try {
          const { email, values } = data
          const user = await this.userRepo.find({ email: email });
          if (!user) {
            throw new Error('User not found');
          }
          const updateData = {
            userId: user._id, 
            bio: values.bio,
            education: values.degree, 
            country: values.country,
            language: values.language,
            experience: values.experience,
            email : email,
            role : values.role
          };
          const updatedProfile = await TutorProfile.findOneAndUpdate(
            { userId: user._id }, 
            { $set: updateData }, 
            { new: true, upsert: true } 
          );
          console.log('Profile updated or created:', updatedProfile);
          return updatedProfile;
        } catch (error : any) {
          console.error("Error editing tutor profile repo:", error);
          throw error;
        }
      }
}
export default TutorRepository