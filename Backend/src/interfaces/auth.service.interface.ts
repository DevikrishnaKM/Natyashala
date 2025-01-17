import {ICleanedUser,IEditUser,ICourse} from "./common.inteface"
export default interface IAuthService {
    signUp(data: any, role: string): Promise<{ user: any; token: string }>;
    otpVerify(email:string,name:string,phone:string,password:string,inputOtp:string,role:'user'|'tutor'):Promise<Boolean>;
    verifyLogin(email:string,password:string):Promise<{userInfo:ICleanedUser;accessToken:string}>;
    resendOtp(email: any): Promise<boolean>; 
    editUser(userId : string ,updateData : object): Promise<IEditUser>;
    saveProfile(profile: Express.Multer.File, userId: string) : Promise<boolean>;
    getProfile(email: string) : Promise<string>
    getCourses(category: string , page: number, limit: number , filter?: string) : Promise<{ courses: ICourse[], totalPages : number}>;
    getCourseDetail(id: string) : Promise<any>; 
}
