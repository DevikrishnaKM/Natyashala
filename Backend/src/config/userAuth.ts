


import { Request, Response, NextFunction } from "express";

import HTTP_statusCode from "../Enums/httpStatusCode";
import userSchema from "../models/userSchema";

async function userAuth(req: Request, res: Response, next: NextFunction) {
   try {
      const userId = req.headers['userid'];
      console.log(userId , "user");
      if(userId) {
         const user = await userSchema.findOne({userId})
         console.log(user);
         
         if(user?.isVerified === true) {
            return res.status(HTTP_statusCode.NoAccess).json('User Blocked')
         }
      }

      next()
      
   } catch (error) {
      return res.status(HTTP_statusCode.InternalServerError).json({ message: 'Server error.' });
   }
}

export default userAuth;
