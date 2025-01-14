import { ITutorProfile } from "./common.inteface";

export default interface ITutorService {
    tutorApplication(files: any, data: any): Promise<void>;
    getApplicationData(email: string): Promise<any>;
    editProfile(data: any) : Promise<ITutorProfile>;
    createCourse( files: any, courseData: any, email: string) : Promise<boolean>;
    getCoursesWithSignedUrls(email: string) : Promise<ICourse[]>
}