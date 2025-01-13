import { v4 as uuidv4 } from "uuid";
import { IAdminRepository } from "../interfaces/admin.repository.interface";
import { IAuthRepository } from "../interfaces/auth.repository.interface";
import ITutorRepository from "../interfaces/tutor.repository.interface";
import { AwsConfig } from "../config/awsFileConfig";
import { ITutorProfile } from "../interfaces/common.inteface";
class TutorService {
  private authRepository: IAuthRepository;
  private adminRepository: IAdminRepository;
  private tutorRepository: ITutorRepository;

  constructor(
    authRepository: IAuthRepository,
    adminRepository: IAdminRepository,
    tutorRepository: ITutorRepository
  ) {
    this.authRepository = authRepository;
    this.adminRepository = adminRepository;
    this.tutorRepository = tutorRepository;
  }
  private awsConfig = new AwsConfig();

  async tutorApplication(files: any, data: any): Promise<void> {
    const fileUrls: { type: string; url: string }[] = [];
    if (files.idProof) {
      const url = await this.awsConfig.uploadFileToS3(
        "tutorApplication/idProofs/",
        files.idProof[0]
      );
      fileUrls.push({ type: "idProof", url });
    }
    if (files.resume) {
      const url = await this.awsConfig.uploadFileToS3(
        "tutorApplication/resume/",
        files.resume[0]
      );
      fileUrls.push({ type: "resume", url });
    }
    if (files.certifications) {
      for (const certificate of files.certifications) {
        const url = await this.awsConfig.uploadFileToS3(
          "tutorApplication/certifications/",
          certificate
        );
        fileUrls.push({ type: "certification", url });
      }
    }
    const applicationId = uuidv4();
    const combinedData = {
      applicationId,
      ...data,
      files: fileUrls,
    };
    await this.tutorRepository.saveApplication(combinedData as any);
  }

  getApplicationData = async (email: string): Promise<any> => {
    try {
      const response = await this.authRepository.getApplicantData(
        email as string
      );
      if (response?.profilePhotoUrl) {
        console.log(typeof response?.profilePhotoUrl);
        const profileUrl = await this.awsConfig.getfile(
          response?.profilePhotoUrl,
          `tutorProfile/profileImgs/`
        );
        return { ...response, profileUrl };
      }
      return response;
    } catch (error: any) {
      console.error(
        "Error getting applicant data for tutor profile in services",
        error.message
      );
      throw new Error(error.message);
    }
  };
  editProfile = async (data: any): Promise<ITutorProfile> => {
    try {
      return await this.tutorRepository.editProfile(data as any);
    } catch (error: any) {
      console.error(
        "Error getting applicant data for tutor profile in services",
        error.message
      );
      throw new Error(error.message);
    }
  };
}

export default TutorService;
