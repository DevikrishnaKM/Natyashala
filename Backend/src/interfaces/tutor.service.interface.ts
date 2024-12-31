import { ITutorProfile } from "./common.inteface";

export default interface ITutorService {
    tutorApplication(files: any, data: any): Promise<void>;
    getApplicationData(email: string): Promise<any>;
    editProfile(data: any) : Promise<ITutorProfile>;
}