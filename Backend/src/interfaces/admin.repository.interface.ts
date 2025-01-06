import { IUser ,ITutorApplication} from "./common.inteface";
export interface IAdminRepository {
    getUsers(page: number, limit: number): Promise<{ users: IUser[]; total: number }>;
   blockUser(email: string): Promise<boolean>;
   unBlockUser(email: string): Promise<boolean>;
   getApplications(): Promise<ITutorApplication[]>;
   findApplication(id : string) : Promise<ITutorApplication | null>;
   addTutorCredential(email : string , passcode : string) : Promise<boolean >;
}