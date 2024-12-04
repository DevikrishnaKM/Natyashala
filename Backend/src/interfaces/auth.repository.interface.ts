import {IUser} from "./common.inteface";

export interface IAuthRepository {
    findUser(email : string) : Promise<IUser | null>;
}