import {IUser,ICleanedUser,ICourse} from "./common.inteface";

export interface IAuthRepository {
    findUser(email : string) : Promise<IUser | null>;
    createUser(userData: { name: string, email: string, phone: string, password: string,role:'user'|'tutor'}): Promise<IUser|boolean>;
    validateLoginUser(email: string,password: string): Promise<ICleanedUser>;
    editUser(userid: string,newUserInfo: object): Promise<IUser | null>;
    saveProfile(userId: string, profileUrl: string) : Promise<boolean>;
    getApplicantData(email: string) : Promise<any>;
    getCourses(category: string, page: number, limit: number , filter?: string) : Promise<{courses :any,totalPages : number }>;
    getCourse(id: string): Promise<ICourse>;
    courseDetails(id: string) : Promise<any>; 
}