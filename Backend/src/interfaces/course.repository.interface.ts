import { ICourse ,IVideo} from "./common.inteface";


export default interface ICourseRepository {
    // getUserCourses(userId: string, type: string) : Promise<ICourse[]>;
    updateCourse(couresId: string, newData: any) : Promise <ICourse>
    updateVid(_id : string, title : string , description : string) : Promise<IVideo>
    deleteVideo(videoId: string, courseId: string) : Promise<boolean | null>
}