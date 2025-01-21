import { IUser, ITutorApplication, ICategory,ICourse } from "./common.inteface";
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
}
