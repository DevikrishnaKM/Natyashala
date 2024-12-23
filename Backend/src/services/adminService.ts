import { IAdminServices } from "../interfaces/admin.service.interface";
// import { IAdminRepository } from "../interfaces/admin.repository.interface";
import { createRefreshToken, createToken } from "../config/jwtConfig";

const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD;

class AdminServices implements IAdminServices{
    // private adminRepository:IAdminRepository
    // constructor(adminRepository:IAdminRepository){
    //     this.adminRepository = adminRepository
    // }
    login=(email:string,password:string):{adminAccessToken: string,adminRefreshToken: string}=>{
        try {
            if(email !== adminEmail){
                throw new Error("Invalid Email")
            }else if(password !== adminPassword){
                throw new Error("Invalid Password")
            }
            const adminAccessToken: string = createToken(email as string, "Admin");
            const adminRefreshToken: string = createRefreshToken(
             email as string,
               "Admin"
             );
             return { adminAccessToken, adminRefreshToken };
        } catch (error:any) {
            console.error("Error during admin login services:", error.message);
            throw error;
        }
    }
}
export default AdminServices

