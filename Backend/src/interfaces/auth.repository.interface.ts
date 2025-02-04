import {IUser,ICleanedUser,ICourse, IOrder,IRating} from "./common.inteface";

export interface IAuthRepository {
    findUser(email : string) : Promise<IUser | null>;
    findUserById(userId: string): Promise<IUser>
    createUser(userData: { name: string, email: string, phone: string, password: string,role:'user'|'tutor'}): Promise<IUser|boolean>;
    validateLoginUser(email: string,password: string): Promise<ICleanedUser>;
    editUser(userid: string,newUserInfo: object): Promise<IUser | null>;
    saveProfile(userId: string, profileUrl: string) : Promise<boolean>;
    getApplicantData(email: string) : Promise<any>;
    getCourses(category: string, page: number, limit: number , filter?: string) : Promise<{courses :any,totalPages : number }>;
    getCourse(id: string): Promise<ICourse>;
    courseDetails(id: string) : Promise<any>; 
    saveOder(orderData: any) : Promise<boolean>;
    updateOrder(sessionId:string,orderId:string):Promise<boolean>
    confirmOrder(courseId:string):Promise<any>
    saveCourse(courseId: string, email: string) : Promise<boolean>;
    coursePaymentWallet(userId: string,amount: any,courseName: string) : Promise<any>;
    getApplicantData(email: string) : Promise<any>;
    ratings(courseId: string) : Promise<IRating[]>
    addRating(newRating : object) : Promise<IRating> 
}