import {ICleanedUser,IEditUser,ICourse,ITutorData,IRating,IWallet} from "./common.inteface"
export default interface IAuthService {
    signUp(data: any, role: string): Promise<{ user: any; token: string }>;
    googleLogin(userdata:any):Promise<any>
    otpVerify(email:string,name:string,phone:string,password:string,inputOtp:string,role:'user'|'tutor',referralCode:string):Promise<Boolean>;
    verifyLogin(email:string,password:string):Promise<{userInfo:ICleanedUser;accessToken:string}>;
    resendOtp(email: any): Promise<boolean>; 
    editUser(userId : string ,updateData : object): Promise<IEditUser>;
    saveProfile(profile: Express.Multer.File, userId: string) : Promise<boolean>;
    getProfile(email: string) : Promise<string>
    getCourses(category: string , page: number, limit: number , filter?: string) : Promise<{ courses: any, totalPages : number}>;
    getCourseDetail(id: string) : Promise<any>; 
    checkEnrollement(courseId: string, email: string) : Promise<boolean>;
    createSession(amount: number,email: string,courseId: string,courseName:string) : Promise<any>;
    confirmCourse(orderId:string,courseId:string,email:string):Promise<any>
    tutorData(id: string) : Promise<ITutorData>;
    MyCourses(userId: string) : Promise<any>;
    getRatings(courseId: string): Promise<IRating[]>
    addRating(newRating : object) : Promise<IRating> ;
    addMoney(userId: string , amount : number) : Promise<any>
    getTransactions(userId: string) : Promise<IWallet | null>;
    getOrders(userId: string) : Promise<any>;
    addWishlist(courseId:string,email:string) : Promise<any> ;
    checkWishlist(courseId:string,email:string) : Promise<any> ;
    wishlist(email:string) : Promise<any> ;
    wishlist(email:string,courseId:string) : Promise<any> ;
}