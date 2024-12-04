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
}

export default AuthController;
