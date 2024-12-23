import { IUser } from "./common.inteface";
export interface IAdminRepository {
getUsers(page: number, limit: number): Promise<{ users: IUser[]; total: number }>;
blockUser(email: string): Promise<boolean>;
unBlockUser(email: string): Promise<boolean>;
}