import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
import HTTP_statusCode from "../Enums/httpStatusCode";


dotenv.config();

const secret_key = process.env.JWT_SECRET as string;

export const createToken =(id:string,role:string):string=>{
    return jwt.sign({id,role},secret_key,{expiresIn:process.env.JWT_EXPIRES_IN});
}

export const createSendToken = (user: any, statusCode: number, res: Response, message: string) => {
    const token = createToken(user._id,user.role);
    const cookieOptions = {
      expires: new Date(
        Date.now() +
          parseInt(process.env.JWT_COOKIE_EXPIRES_IN || '90') * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
    };
    res.cookie('jwt', token, cookieOptions);
  
    user.password = undefined; // Ensure password is not sent in the response
    user.confirmPassword = undefined; // Clear confirm password
  
    res.status(statusCode).json({
      status: 'success',
      token,
      data: {
        user,
      },
      message,
    });
  };
  