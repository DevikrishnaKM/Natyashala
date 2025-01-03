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


 verifyLogin = catchAsync(async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await this.authService.verifyLogin(email, password);

    // Set cookies for tokens
    res.cookie("RefreshToken", result.refreshToken, {
      httpOnly: true,
      secure: true, 
      sameSite: 'none', 
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/'
    });
    res.cookie("AccessToken", result.accessToken, {
      httpOnly: true,
      secure: true, 
      sameSite: 'none',
      maxAge: 15 * 60 * 1000, // 15 minutes
      path: '/'
    });

    // Include accessToken and userInfo in response
    const { userInfo,accessToken } = result;
    const cred = { userInfo,accessToken }; // Include accessToken
    res.status(HTTP_statusCode.OK).json({ message: "Login successful", cred });
  } catch (error: any) {
    console.error("Auth Controller => Error in verifying login", error);

    // Handle specific error messages
    if (error.message === "You are restricted.") {
      return res.status(HTTP_statusCode.NoAccess).json({ message: error.message });
    } else if (error.message === "User doesn't exist") {
      return res.status(HTTP_statusCode.NotFound).json({ message: error.message });
    } else if (error.message === "Invalid password") {
      return res.status(HTTP_statusCode.Conflict).json({ message: error.message });
    } else {
      return res.status(HTTP_statusCode.InternalServerError).json({ message: error.message });
    }
  }
});

 resendOtp = catchAsync(async(req: Request, res: Response) => {
  try { 
    const { email } = req.body;
    console.log("controller email resend", email);
    await this.authService.resendOtp(email);
    res.status(HTTP_statusCode.OK).json(true)
  } catch (error : any) {
    console.log("User Controller => Error in veryfing login ", error);
    res.status(HTTP_statusCode.InternalServerError).json({ message : error.message})
  }
})


editUser = catchAsync(async(req : Request ,  res : Response) => {
  try {
    const {name, phone ,userId} = req.body
    const updateData = {
      name,
      phone,
    }
    const updatedUser = await this.authService.editUser(userId ,updateData);
    res.status(HTTP_statusCode.OK).json({ message: 'User updated successfully', data: updatedUser }); 
  } catch (error : any) {
    if (error.message === "No changes detected") {
      res.status(HTTP_statusCode.NoChange).json({ message: "No changes founded" });
   } else {
      res.status(500).json({ message: 'Internal Server Error' });
   }
  }
})
  
saveProfilePic = catchAsync(async(req : Request, res : Response) => {
  try {
    const profile = req.file
    const userId = req.body.userId 
    if(!profile) {
      throw new Error("No profile given")
    }
    const status = await this.authService.saveProfile(profile as Express.Multer.File , userId as string)
    res.status(HTTP_statusCode.updated).json(status) 
  } catch (error : any) {
    console.error(error.message);
    if(error.message === "No profile given") {
      res.status(HTTP_statusCode.NotFound).json(error.message)
    }
    res.status(HTTP_statusCode.InternalServerError).json({ message: error.message });
  }
})

getProfile = async(req : Request, res : Response) => {
  try {
   const {email} = req.params
   const profileUrl = await this.authService.getProfile(email as string)  
   res.status(HTTP_statusCode.OK).json(profileUrl)
  } catch (error : any) {
    console.error(error.message);
    res.status(HTTP_statusCode.InternalServerError).json({ message: error.message });
  }
}
}

export default AuthController;
