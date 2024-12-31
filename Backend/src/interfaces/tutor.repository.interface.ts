import { ITutorProfile } from "./common.inteface";

export default interface ITutorRepository {
    saveApplication(data: any): Promise<void>;
    editProfile(data : any) : Promise<ITutorProfile>;
}