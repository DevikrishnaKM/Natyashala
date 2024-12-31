import { IAdminServices } from "../interfaces/admin.service.interface";
import { IAdminRepository } from "../interfaces/admin.repository.interface";
import { createRefreshToken, createToken } from "../config/jwtConfig";
import { ICleanedUser,ITutorApplication,FileUrl } from "../interfaces/common.inteface";
import { AwsConfig } from "../config/awsFileConfig";
import getFolderPathByFileType from "../helper/filePathHandler";

const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD;

class AdminServices implements IAdminServices {
  private adminRepository: IAdminRepository;
  constructor(adminRepository: IAdminRepository) {
    this.adminRepository = adminRepository;
  }
  aws = new AwsConfig();
  login = (
    email: string,
    password: string
  ): { adminAccessToken: string; adminRefreshToken: string } => {
    try {
      if (email !== adminEmail) {
        throw new Error("Invalid Email");
      } else if (password !== adminPassword) {
        throw new Error("Invalid Password");
      }
      const adminAccessToken: string = createToken(email as string, "Admin");
      const adminRefreshToken: string = createRefreshToken(
        email as string,
        "Admin"
      );
      return { adminAccessToken, adminRefreshToken };
    } catch (error: any) {
      console.error("Error during admin login services:", error.message);
      throw error;
    }
  };
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
      console.error(
        "Error during admin getting users services:",
        error.message
      );
      throw error;
    }
  };
  blockUser = async (email: string): Promise<boolean> => {
    try {
      return await this.adminRepository.blockUser(email);
    } catch (error: any) {
      console.error(
        "Error during admin blocking user in  services:",
        error.message
      );
      throw error;
    }
  };

  unBlockUser = async (email: string): Promise<boolean> => {
    try {
      return await this.adminRepository.unBlockUser(email);
    } catch (error: any) {
      console.error(
        "Error during admin blocking user in  services:",
        error.message
      );
      throw error;
    }
  };

  getApplications = async (): Promise<ITutorApplication[]> => {
    try {
      return await this.adminRepository.getApplications();
    } catch (error: any) {
      console.error(
        "Error during admin getting  applications in  services:",
        error.message
      );
      throw error;
    }
  };

  findApplication = async (id: string): Promise<ITutorApplication> => {
    try {
      const response = await this.adminRepository.findApplication(id);
      if (!response) {
        throw new Error("Application not found");
      }
      if (response.files) {
        const signedFiles = await Promise.all(
          response.files.map(async (file: { type: string; url: string }) => {
            const [uniqueName, ...rest] = file.url.split("-");
            const folderPath = getFolderPathByFileType(file.type);
            const signedUrl = await this.aws.getfile(file.url, folderPath);
            return { signedUrl, ...file };
          })
        );
        response.files = signedFiles as FileUrl[];
      }
      return response;
    } catch (error: any) {
      console.error(
        "Error during admin getting one applicant services:",
        error.message
      );
      throw error;
    }
  };
}
export default AdminServices;
