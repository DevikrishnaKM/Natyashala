import { ITutorProfile,ICourse,INewCourseDetails ,IVideo,ITutorDashBoard,IMonthlyEnrollment,IMonthlyRevenue} from "./common.inteface";

export default interface ITutorService {
    tutorApplication(files: any, data: any): Promise<void>;
    getApplicationData(email: string): Promise<any>;
    editProfile(data: any) : Promise<ITutorProfile>;
    createCourse( files: any, courseData: any, email: string) : Promise<boolean>;
    getCoursesWithSignedUrls(email: string) : Promise<ICourse[]>
    updateCourse(courseId: string, newData: any) : Promise<INewCourseDetails>
    updateVideo(_id : string, title : string , description : string) : Promise<IVideo>
    deleteVideo(videoId : string, courseId : string ) : Promise<boolean | null>
    addVideo(name : string, description : string , newVideo : any, sectionId : string , courseId : string) : Promise<IVideo>
    getDashboard(email: string) : Promise<ITutorDashBoard> 
    getMonthlyData(year: number) :  Promise<{enrollments : IMonthlyEnrollment[] ,revenue :IMonthlyRevenue[] }>
}