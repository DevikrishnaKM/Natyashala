import { ITutorProfile,ICourseData,ICourse,IVideo } from "./common.inteface";

export default interface ITutorRepository {
    saveApplication(data: any): Promise<void>;
    editProfile(data : any) : Promise<ITutorProfile>;
    saveCourse(data: ICourseData, email: string) : Promise<boolean> ;
    getCoursesByTutor(email: string) : Promise<ICourse[]>
    addVideo (name : string, description : string , newVideo : string, sectionId : string , courseId : string) : Promise<IVideo>
}