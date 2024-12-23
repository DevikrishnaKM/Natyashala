import {ICleanedUser} from "./common.inteface"
export default interface IAuthService {
    signUp(data: any, role: string): Promise<{ user: any; token: string }>;
    otpVerify(email:string,name:string,phone:string,password:string,inputOtp:string,role:'user'|'tutor'):Promise<Boolean>;
    verifyLogin(email:string,password:string):Promise<{userInfo:ICleanedUser;accessToken:string}>;
}
