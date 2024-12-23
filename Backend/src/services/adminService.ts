import { IAdminServices } from "../interfaces/admin.service.interface";
import { IAdminRepository } from "../interfaces/admin.repository.interface";
import { createRefreshToken, createToken } from "../config/jwtConfig";
import { ICleanedUser } from "../interfaces/common.inteface";

const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD;

class AdminServices implements IAdminServices{
    private adminRepository:IAdminRepository
    constructor(adminRepository:IAdminRepository){
        this.adminRepository = adminRepository
    }
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
    getUsersList = async (
        page: number,
        limit: number
      ): Promise<{ users: ICleanedUser[]; total: number }> => {
        try {
          if (typeof page !== "number" || page < 1) {
            throw new Error("Invalid page number");
          }
          if (typeof limit !== "number" || limit < 1) {
            throw new Error("Invalid limit value");
          }
      
          // Fetch users and total count from the repository
          const { users, total } = await this.adminRepository.getUsers(page, limit);
      
          // Filter for role "user" and map the data
          const cleanedUsers: ICleanedUser[] = users
            .filter((user: any) => user._doc.role === "user") // Filter by role
            .map((user: any) => {
              const {
                userId,
                name,
                email,
                phone,
                isVerified,
                role,
                profilePicture,
                createdAt,
              } = user._doc;
              return {
                userId,
                name,
                email,
                phone,
                role,
                isVerified,
                profilePicture,
                createdAt,
              };
            });
      
          return { users: cleanedUsers, total };
        } catch (error: any) {
          console.error("Error during admin getting users services:", error.message);
          throw error;
        }
      };
blockUser = async(email : string) : Promise<boolean> => {
        try {
         return await this.adminRepository.blockUser(email)
        } catch (error : any) {
            console.error("Error during admin blocking user in  services:", error.message);
            throw error;
}
 }

 unBlockUser = async(email : string) : Promise<boolean> => {
  try {
   return await this.adminRepository.unBlockUser(email)
  } catch (error : any) {
      console.error("Error during admin blocking user in  services:", error.message);
      throw error;
  }
}

      
}
export default AdminServices

