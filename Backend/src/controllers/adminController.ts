import { Request, Response } from "express";
import HTTP_statusCode from "../Enums/httpStatusCode";
import appError from "../utils/appError";
import { IAdminServices } from "../interfaces/admin.service.interface";
import catchAsync from "../utils/catchAsync";

class AdminController {
  private adminService: IAdminServices;

  constructor(adminService: IAdminServices) {
    this.adminService = adminService;
  }

  login = catchAsync(async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      console.log("admin login", email, password);
      const serviceResponse = await this.adminService.login(email, password);
      res.cookie("AdminRefreshToken", serviceResponse.adminRefreshToken, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      res.cookie("AdminAccessToken", serviceResponse.adminAccessToken, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
        maxAge: 15 * 60 * 1000,
      });
      res.status(HTTP_statusCode.OK).send(serviceResponse);
    } catch (error: any) {
      console.log("Admin := login error", error);
      if (error.message === "Invalid email") {
        res
          .status(HTTP_statusCode.NotFound)
          .json({ message: "Email is wrong" });
      } else if (error.message === "Invalid password") {
        res
          .status(HTTP_statusCode.NotFound)
          .json({ message: "password is wrong" });
      }
    }
  });
  getUsers = catchAsync(async (req: Request, res: Response) => {
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 10;
      const { users, total } = await this.adminService.getUsersList(
        page,
        limit
      );
      console.log(users, total);
      res.status(200).json({
        users,
        total,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
      });
    } catch (error: any) {
      console.log("Admin := getusers error", error);
      if (error.message === "Invalid page number") {
        res
          .status(HTTP_statusCode.BadRequest)
          .json({ message: "Invalid page number" });
      } else if (error.message === "Invalid limit value") {
        res
          .status(HTTP_statusCode.BadRequest)
          .json({ message: "Invalid limit value" });
      }
      res
        .status(HTTP_statusCode.InternalServerError)
        .json({ message: error.message });
    }
  });
  blockUser = async (req: Request, res: Response) => {
    try {
      const { email } = req.params;
      const status = await this.adminService.blockUser(email);
      res.status(HTTP_statusCode.updated).json(status);
    } catch (error: any) {
      console.log("Admin := getusers error in controller", error);
      if (error.message === "User not found") {
        res
          .status(HTTP_statusCode.NotFound)
          .json({ message: "User not found" });
      } else if (error.message === "User is already blocked") {
        res
          .status(HTTP_statusCode.NotFound)
          .json({ message: "User is already blocked" });
      }
      res
        .status(HTTP_statusCode.InternalServerError)
        .json({ message: error.message });
    }
  };
  unblockUser = async (req: Request, res: Response) => {
    try {
      const { email } = req.params;
      const status = await this.adminService.unBlockUser(email);
      res.status(HTTP_statusCode.updated).json(status);
    } catch (error: any) {
      console.log("Admin := getusers error in controller", error);
      if (error.message === "User not found") {
        res
          .status(HTTP_statusCode.NotFound)
          .json({ message: "User not found" });
      } else if (error.message === "User is already unblocked") {
        res
          .status(HTTP_statusCode.NotFound)
          .json({ message: "User is already unblocked" });
      }
      res
        .status(HTTP_statusCode.InternalServerError)
        .json({ message: error.message });
    }
  };
  getApplications = async (req: Request, res: Response) => {
    try {
      const getApplications = await this.adminService.getApplications();
      console.log("appli:", getApplications);
      res.status(HTTP_statusCode.OK).json(getApplications);
    } catch (error: any) {
      console.log("Admin := getusers error in controller", error);
      res
        .status(HTTP_statusCode.InternalServerError)
        .json({ message: error.message });
    }
  };

  findApplication = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      // console.log(id,"id")
      const applicant = await this.adminService.findApplication(id);
      // console.log("applicat:",applicant)
      res.status(HTTP_statusCode.OK).json(applicant);
    } catch (error: any) {
      console.log("Admin := getusers error in controller", error);
      res
        .status(HTTP_statusCode.InternalServerError)
        .json({ message: error.message });
    }
  };

  acceptApplication = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      // console.log(id,"id")
      const response = await this.adminService.acceptApplication(id);
      console.log("res:", response);
      res.status(HTTP_statusCode.updated).json(response);
    } catch (error: any) {
      console.log("Admin := getusers error in controller", error);
      res
        .status(HTTP_statusCode.InternalServerError)
        .json({ message: error.message });
    }
  };

  rejectApplication = catchAsync(async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const response = await this.adminService.rejectApplication(id);
      console.log("res:", response);
      res.status(HTTP_statusCode.updated).json(response);
    } catch (error: any) {
      console.log("Admin := error in controller", error);
      res
        .status(HTTP_statusCode.InternalServerError)
        .json({ message: error.message });
    }
  });

  checkTutorStatus = async (req: Request, res: Response) => {
    try {
      const { email } = req.params;
      const response = await this.adminService.checkTutorStatus(email);
      console.log("res in controller", response);
      res.status(HTTP_statusCode.OK).json(response);
    } catch (error: any) {
      console.log("Admin := getusers error in controller", error);
      res
        .status(HTTP_statusCode.InternalServerError)
        .json({ message: error.message });
    }
  };

  getTutors = async (req: Request, res: Response) => {
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 10;
      const { tutors, total } = await this.adminService.getTutors(page, limit);
      res.status(200).json({
        tutors,
        total,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
      });
    } catch (error: any) {
      console.log("Admin := getusers error in controller", error);
      if (error.message === "Invalid page number") {
        res
          .status(HTTP_statusCode.BadRequest)
          .json({ message: "Invalid page number" });
      } else if (error.message === "Invalid limit value") {
        res
          .status(HTTP_statusCode.BadRequest)
          .json({ message: "Invalid limit value" });
      }
      res.status(500).json({ message: error.message });
    }
  };

  createCategory = catchAsync(async (req: Request, res: Response) => {
    try {
      const { categoryName, description } = req.body;
      const response = await this.adminService.createCategory(
        categoryName as string,
        description as string
      );
      res.status(HTTP_statusCode.updated).json(response);
    } catch (error: any) {
      console.log("Admin := getusers error in controller", error);
      if (error.message === "Category already exists.") {
        return res
          .status(HTTP_statusCode.Conflict)
          .json({ message: error.message });
      }
      res
        .status(HTTP_statusCode.InternalServerError)
        .json({ message: error.message });
    }
  });
  getCategories = async (req: Request, res: Response) => {
    try {
      const response = await this.adminService.getCategories();
      res.status(HTTP_statusCode.OK).json(response);
    } catch (error: any) {
      res
        .status(HTTP_statusCode.InternalServerError)
        .json({ message: error.message });
    }
  };
  getCourses = async (req: Request, res: Response) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const { courses, totalCourses } = await this.adminService.getCourses(
        page,
        limit
      );
      const totalPages = Math.ceil(totalCourses / limit);
      res.status(HTTP_statusCode.OK).json({ courses, totalPages });
    } catch (error: any) {
      res
        .status(HTTP_statusCode.InternalServerError)
        .json({ message: error.message });
    }
  };

  blockCourse = async (req: Request, res: Response) => {
    try {
      const { courseId } = req.params;
      const response = await this.adminService.blockCourse(courseId);
      res.status(HTTP_statusCode.updated).json(response);
    } catch (error: any) {
      res
        .status(HTTP_statusCode.InternalServerError)
        .json({ message: error.message });
    }
  };

  unBlockCourse = async (req: Request, res: Response) => {
    try {
      const { courseId } = req.params;
      const response = await this.adminService.unBlockCourse(courseId);
      res.status(HTTP_statusCode.updated).json(response);
    } catch (error: any) {
      res
        .status(HTTP_statusCode.InternalServerError)
        .json({ message: error.message });
    }
  };
  findCourse = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      console.log(id,"id")
      const applicant = await this.adminService.findCourse(id);
      console.log("applicat:",applicant)
      res.status(HTTP_statusCode.OK).json(applicant);
    } catch (error: any) {
      console.log("Admin := getusers error in controller", error);
      res
        .status(HTTP_statusCode.InternalServerError)
        .json({ message: error.message });
    }
  };
  acceptCourse = async (req: Request, res: Response) => {
    try {
      console.log("starting")
      const { courseId } = req.params;
      console.log(courseId,"id")
      const response = await this.adminService.acceptCourse(courseId);
      console.log("res:", response);
      res.status(HTTP_statusCode.updated).json({message:"Course verified successfully",response});
    } catch (error: any) {
      console.log("Admin := getusers error in controller", error);
      res
        .status(HTTP_statusCode.InternalServerError)
        .json({ message: error.message });
    }
  };
}
export default AdminController;
