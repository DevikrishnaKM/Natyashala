import { Request, Response } from "express";
import HTTP_statusCode from "../Enums/httpStatusCode";
import ITutorService from "../interfaces/tutor.service.interface";
import catchAsync from "../utils/catchAsync";

class TutorController {
  private tutorServices: ITutorService;
  constructor(tutorServices: ITutorService) {
    this.tutorServices = tutorServices;
  }
  tutorApplication = catchAsync(
    async (req: Request, res: Response): Promise<void | boolean> => {
      try {
        const files = (req as any).files as {
          [fieldname: string]: Express.Multer.File[];
        };
        if (files) {
          console.log("Uploaded files:", files);
        } else {
          console.log("no files uploaded");
        }
        const data = req.body;
        await this.tutorServices.tutorApplication(files, data);
        res
          .status(HTTP_statusCode.OK)
          .send({ success: true, message: "Application recieved" });
      } catch (error: any) {
        console.error("error in tutorApplicatin controller:", error);
        res
          .status(HTTP_statusCode.InternalServerError)
          .send({ success: false, message: "Internal Server Error" });
      }
    }
  );
  getTutorDetails = async (req: Request, res: Response) => {
    try {
      const { email } = req.params;
      const response = await this.tutorServices.getApplicationData(
        email as string
      );
      res.status(HTTP_statusCode.OK).json(response);
    } catch (error: any) {
      console.error(error.message);
      res
        .status(HTTP_statusCode.InternalServerError)
        .json({ message: error.message });
    }
  };
  editProfile = async (req: Request, res: Response) => {
    try {
      const data = req.body;
      const response = await this.tutorServices.editProfile(data as any);
      res.status(HTTP_statusCode.OK).json(response);
    } catch (error: any) {
      console.error(error.message);
      res
        .status(HTTP_statusCode.InternalServerError)
        .json({ message: error.message });
    }
  };
  async createCourse(req: Request, res: Response) {
    try {
      const courseData = req.body;
      const { email } = req.params;
      const files = req.files as Express.Multer.File[];
      const response = await this.tutorServices.createCourse(
        files,
        courseData,
        email
      );
      res.status(HTTP_statusCode.updated).json(response);
    } catch (error: any) {
      console.error(error.message);
      res
        .status(HTTP_statusCode.InternalServerError)
        .json({ message: error.message });
    }
  }

  getCourses =async(req: Request, res: Response) => {
    try {
      const { email } = req.params;
      const response = await this.tutorServices.getCoursesWithSignedUrls(email);
      res.status(HTTP_statusCode.OK).json(response);
    } catch (error: any) {
      console.error(error.message, "dsfsdf");
      res
        .status(HTTP_statusCode.InternalServerError)
        .json({ message: error.message });
    }
  }
}

export default TutorController;
