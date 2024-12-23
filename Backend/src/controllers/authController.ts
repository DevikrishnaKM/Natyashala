import { Request, Response, NextFunction } from 'express';
import AuthService from '../services/authService';
import AppError from '../utils/appError';
import catchAsync from '../utils/catchAsync';
import { createSendToken } from '../config/jwtConfig';
import HTTP_statusCode from '../Enums/httpStatusCode';

class AuthController {
  private authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  createUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const data = req.body;
    const role = (req.query.role as string)?.toLowerCase();

    if (!role || !['user', 'tutor'].includes(role)) {
      return next(new AppError('Invalid role provided', HTTP_statusCode.BadRequest));
    }

    const { user, token } = await this.authService.signUp(data, role);
    createSendToken(user, 201, res, 'Registration successful');
  });

  otpVerification = catchAsync(async (req: Request, res: Response) => {
    try {
        console.log("Incoming OTP verification request:", req.body);
        const { email, name, phone, password, otp,role } = req.body;

        const result = await this.authService.otpVerify(email, name, phone, password, otp,role);
        console.log(result)
        if (result) {
          console.log("otp verified")
            return res.status(HTTP_statusCode.OK).json({ message: "OTP verified" });
        } else {
            return res.status(HTTP_statusCode.Conflict).json({ message: "OTP not verified" });
        }
    } catch (error: any) {
        console.error("Error during OTP verification in controller:", error);
        return res.status(HTTP_statusCode.InternalServerError).json({ message: "Internal Server Error" });
    }
 });


 verifyLogin = catchAsync(async (req: Request,res:Response)=>{
  try {
    const { email, password } = req.body;
    const result = await this.authService.verifyLogin(email,password)
    // console.log(result)
    res.cookie("RefreshToken", result.refreshToken, {
      httpOnly: true,
      secure: true, 
      sameSite: 'none', 
      maxAge: 7 * 24 * 60 * 60 * 1000,
       path: '/'
   });
   res.cookie("AccessToken", result.accessToken, {
    httpOnly: true,
    secure: true, 
    sameSite: 'none',
    maxAge: 15 * 60 * 1000,
     path: '/'
   });
   const { userInfo } = result;
   const cred = { userInfo}
   res.status(HTTP_statusCode.OK).json({ message: "Login successful", cred });
  } catch (error:any) {
    console.log("Auth Controller => Error in veryfing login ", error);
    if (error.message === "You are restricted.") {
      res.status(HTTP_statusCode.NoAccess).json({ message: error.message })
    } else if (error.message === "User doesn't exist") {
      res.status(HTTP_statusCode.NotFound).json({ message: error.message })
    } else if(error.message === "Invalid password") {
      res.status(HTTP_statusCode.Conflict).json({ message: error.message })
    } else {
      res.status(HTTP_statusCode.InternalServerError).json({ message: error.message });
    }
  }
 })
  
}

export default AuthController;
