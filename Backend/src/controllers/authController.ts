import { Request, Response, NextFunction } from "express";
import AuthService from "../services/authService";
import AppError from "../utils/appError";
import catchAsync from "../utils/catchAsync";
import { createSendToken } from "../config/jwtConfig";
import HTTP_statusCode from "../Enums/httpStatusCode";

class AuthController {
  private authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  createUser = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const data = req.body;
      const role = (req.query.role as string)?.toLowerCase();

      if (!role || !["user", "tutor"].includes(role)) {
        return next(
          new AppError("Invalid role provided", HTTP_statusCode.BadRequest)
        );
      }

      const { user, token } = await this.authService.signUp(data, role);
      createSendToken(user, 201, res, "Registration successful");
    }
  );

  otpVerification = catchAsync(async (req: Request, res: Response) => {
    try {
      console.log("Incoming OTP verification request:", req.body);
      const { email, name, phone, password, otp, role } = req.body;

      const result = await this.authService.otpVerify(
        email,
        name,
        phone,
        password,
        otp,
        role
      );
      console.log(result);
      if (result) {
        console.log("otp verified");
        return res.status(HTTP_statusCode.OK).json({ message: "OTP verified" });
      } else {
        return res
          .status(HTTP_statusCode.Conflict)
          .json({ message: "OTP not verified" });
      }
    } catch (error: any) {
      console.error("Error during OTP verification in controller:", error);
      return res
        .status(HTTP_statusCode.InternalServerError)
        .json({ message: "Internal Server Error" });
    }
  });

  verifyLogin = catchAsync(async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const result = await this.authService.verifyLogin(email, password);

      // Set cookies for tokens
      res.cookie("RefreshToken", result.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        path: "/",
      });
      res.cookie("AccessToken", result.accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 15 * 60 * 1000, // 15 minutes
        path: "/",
      });

      // Include accessToken and userInfo in response
      const { userInfo, accessToken } = result;
      const cred = { userInfo, accessToken }; // Include accessToken
      res
        .status(HTTP_statusCode.OK)
        .json({ message: "Login successful", cred });
    } catch (error: any) {
      console.error("Auth Controller => Error in verifying login", error);

      // Handle specific error messages
      if (error.message === "You are restricted.") {
        return res
          .status(HTTP_statusCode.NoAccess)
          .json({ message: error.message });
      } else if (error.message === "User doesn't exist") {
        return res
          .status(HTTP_statusCode.NotFound)
          .json({ message: error.message });
      } else if (error.message === "Invalid password") {
        return res
          .status(HTTP_statusCode.Conflict)
          .json({ message: error.message });
      } else {
        return res
          .status(HTTP_statusCode.InternalServerError)
          .json({ message: error.message });
      }
    }
  });

  resendOtp = catchAsync(async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      console.log("controller email resend", email);
      await this.authService.resendOtp(email);
      res.status(HTTP_statusCode.OK).json(true);
    } catch (error: any) {
      console.log("User Controller => Error in veryfing login ", error);
      res
        .status(HTTP_statusCode.InternalServerError)
        .json({ message: error.message });
    }
  });

  editUser = catchAsync(async (req: Request, res: Response) => {
    try {
      const { name, phone, userId } = req.body;
      const updateData = {
        name,
        phone,
      };
      const updatedUser = await this.authService.editUser(userId, updateData);
      res
        .status(HTTP_statusCode.OK)
        .json({ message: "User updated successfully", data: updatedUser });
    } catch (error: any) {
      if (error.message === "No changes detected") {
        res
          .status(HTTP_statusCode.NoChange)
          .json({ message: "No changes founded" });
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  });

  saveProfilePic = catchAsync(async (req: Request, res: Response) => {
    try {
      const profile = req.file;
      const userId = req.body.userId;

      if (!profile) {
        throw new Error("No profile given");
      }

      const status = await this.authService.saveProfile(
        profile as Express.Multer.File,
        userId as string
      );

      if (status) {
        res
          .status(HTTP_statusCode.updated)
          .json({ message: "Profile updated successfully." });
      } else {
        throw new Error("Failed to update profile in database");
      }
    } catch (error: any) {
      console.error("Error in saveProfilePic:", error.message);
      res
        .status(HTTP_statusCode.InternalServerError)
        .json({ message: error.message });
    }
  });

  getProfile = async (req: Request, res: Response) => {
    try {
      const { email } = req.params;
      const profileUrl = await this.authService.getProfile(email as string);
      //  console.log("profileUrl in authcon:",profileUrl)
      res.status(HTTP_statusCode.OK).json(profileUrl);
    } catch (error: any) {
      console.error(error.message);
      res
        .status(HTTP_statusCode.InternalServerError)
        .json({ message: error.message });
    }
  };

  async getCourses(req: Request, res: Response) {
    try {
      const {
        category,
        page = "1",
        limit = "10",
        filter,
      } = req.query as {
        category?: string;
        page?: string;
        limit?: string;
        filter?: string;
      };
      const pageNumber = parseInt(page, 10);
      const limitNumber = parseInt(limit, 10);
      const courses = await this.authService.getCourses(
        category as string,
        pageNumber,
        limitNumber
      );
      console.log("courses",courses)
      res.status(HTTP_statusCode.OK).json(courses);
    } catch (error: any) {
      console.error(error.message);
      res
        .status(HTTP_statusCode.InternalServerError)
        .json({ message: error.message });
    }
  }
  
  courseDetails = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const courseData = await this.authService.getCourseDetail(id as string);
      res.status(HTTP_statusCode.OK).json(courseData);
    } catch (error: any) {
      console.error(error.message);
      res
        .status(HTTP_statusCode.InternalServerError)
        .json({ message: error.message });
    }
  };

  checkEnrollement = catchAsync(async(req:Request,res:Response)=>{
    try {
      const {courseId,email} = req.params
      const response = await this.authService.checkEnrollment(courseId as string, email as string)
      res.status(HTTP_statusCode.OK).json(response)
    } catch (error:any) {
      console.error(error.message);
      res
        .status(HTTP_statusCode.InternalServerError)
        .json({ message: error.message });
    }
  })

  createOrder = catchAsync(async(req:Request,res:Response)=>{
    try {
      const {amount,email,courseId,courseName} = req.body
      const session = await this.authService.createSession(amount as number,email,courseId,courseName)
      console.log("client_secret:",session)
      res.status(HTTP_statusCode.updated).json({ message: 'Order created successfully', session })
    } catch (error:any) {
      console.error(error.message);
      res
        .status(HTTP_statusCode.InternalServerError)
        .json({ message: error.message });
    }
  })

  confirmPayment = catchAsync(async(req:Request,res:Response) => {
    try {
      const {orderId} = req.body
      const response = await this.authService.confirmCourse(orderId)
      console.log("res:",response)
      res.status(HTTP_statusCode.OK).json({message:"course confirmed",response})
    } catch (error:any) {
      console.error(error.message);
      res
        .status(HTTP_statusCode.InternalServerError)
        .json({ message: error.message });
    }
  })

  tutorDetail = async(req : Request, res : Response) => {
    try {
       const {id} = req.params
       const tutorData =  await this.authService.tutorData(id as string)
       res.status(HTTP_statusCode.OK).json(tutorData)
    } catch (error :any) {
      console.error(error.message);
      res.status(HTTP_statusCode.InternalServerError).json({ message: error.message });
    }
  }
 
}

export default AuthController;
