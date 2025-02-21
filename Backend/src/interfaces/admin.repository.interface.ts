import { IUser, ITutorApplication, ICategory,ICourse,IUserAggregationResult,IReport,ICleanedReport } from "./common.inteface";
export interface IAdminRepository {
  getUsers(
    page: number,
    limit: number
  ): Promise<{ users: IUser[]; total: number }>;
  blockUser(email: string): Promise<boolean>;
  unBlockUser(email: string): Promise<boolean>;
  getApplications(): Promise<ITutorApplication[]>;
  findApplication(id: string): Promise<ITutorApplication | null>;
  changeStatus(id: string): Promise<ITutorApplication | any>;
  updateStatus(id: string): Promise<ITutorApplication | any>;
  addTutorCredential(email: string, passcode: string): Promise<boolean>;
  getTutors(
    page: number,
    limit: number
  ): Promise<{ tutors: IUser[]; total: number }>;
  createCategory(categoryName: string, description: string): Promise<boolean>;
  getCategories(): Promise<ICategory[]>;
  getCourses(skip: number, limit: number) : Promise<{courses :ICourse[] , totalCourses : number}>; 
  adminPaymentWallet(adminShare : any, data :any) : Promise<any> 
  blockCourse(courseId: string) : Promise<string>
  unBlockCourse(courseId: string) : Promise<string> 
  findCourse(id: string): Promise<any>;
  acceptCourse(id:string):Promise<any>
  getTopTutors() : Promise<any>;
  getTopCourses(): Promise<any>
  getDasboard() : Promise<{users : number, courses : number, tutors : number}>
  getUserAndTutorStatsByMonth(): Promise<IUserAggregationResult[]>;
  saveReport(reportData : object) : Promise<boolean>;
  getReports(skip: number, limit: number) : Promise <IReport[]>;
  countReports() : Promise<number>;
  reportDetail(reportId: string) : Promise<ICleanedReport>
}
