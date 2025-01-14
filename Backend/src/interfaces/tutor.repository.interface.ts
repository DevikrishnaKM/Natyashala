import { ITutorProfile,ICourseData } from "./common.inteface";

export default interface ITutorRepository {
    saveApplication(data: any): Promise<void>;
    editProfile(data : any) : Promise<ITutorProfile>;
    saveCourse(data: ICourseData, email: string) : Promise<boolean> ;
    getCoursesByTutor(email: string) : Promise<ICourse[]>
}