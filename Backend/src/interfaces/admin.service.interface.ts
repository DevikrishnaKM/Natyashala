import { ICleanedUser,ITutorApplication } from "./common.inteface";
export interface IAdminServices {
    login(email:string,password:string):{adminAccessToken:string,adminRefreshToken:string}
    getUsersList(page: number, limit: number) : Promise<{ users: ICleanedUser[]; total: number }>;
    blockUser(email : string) : Promise<boolean>;
    unBlockUser(email : string) : Promise<boolean>;
    getApplications() : Promise <ITutorApplication[]>
    findApplication(id : string) : Promise<ITutorApplication>;
}