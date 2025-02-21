import { ICleanedUser,ITutorApplication,ICategory, ICourse,IUser, IUserAggregationResult,IReport,IReportData} from "./common.inteface";
export interface IAdminServices {
    login(email:string,password:string):{adminAccessToken:string,adminRefreshToken:string}
    getUsersList(page: number, limit: number) : Promise<{ users: ICleanedUser[]; total: number }>;
    blockUser(email : string) : Promise<boolean>;
    unBlockUser(email : string) : Promise<boolean>;
    getApplications() : Promise <ITutorApplication[]>
    findApplication(id : string) : Promise<ITutorApplication>;
    acceptApplication (id : string) : Promise<boolean>;
    rejectApplication (id : string) : Promise<any>;
    checkTutorStatus(email : string) : Promise<boolean | undefined>;
    getTutors(page: number, limit: number) : Promise<{ tutors: ICleanedUser[]; total: number }>;
    createCategory(categoryName : string, description :string) : Promise<boolean>;
    getCategories() : Promise<ICategory[]>;
    getCourses(page: number, limit: number) : Promise<{courses : any,  totalCourses : number }>;
    blockCourse(courseId : string) : Promise<string>
    unBlockCourse(courseId : string): Promise<string>
    findCourse(id : string) : Promise<any>;
    acceptCourse (courseId : string) : Promise<boolean>;
    getTopTutors() : Promise<IUser[]>
    getTopCourses () : Promise<ICourse[]>;
    reportCourse(courseId: string,reason: string,additionalInfo: string) : Promise<boolean>;
    getReports(page: number, limit: number) : Promise<{reports : IReport[] , totalPages : number}>
    reportDetail(reportId : string) : Promise<IReportData>;
    getDashboard () : Promise<{dashboard:{users : number, courses : number, tutors : number}, barGraphData:IUserAggregationResult[]}> 
}