import {IUser,ICleanedUser} from "./common.inteface";

export interface IAuthRepository {
    findUser(email : string) : Promise<IUser | null>;
    createUser(userData: { name: string, email: string, phone: string, password: string,role:'user'|'tutor'}): Promise<IUser|boolean>;
    validateLoginUser(email: string,password: string): Promise<ICleanedUser>;
}