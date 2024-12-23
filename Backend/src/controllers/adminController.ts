import { Request, Response } from "express";
import HTTP_statusCode from "../Enums/httpStatusCode";
import appError from "../utils/appError";
import { IAdminServices } from "../interfaces/admin.service.interface";
import catchAsync from "../utils/catchAsync"
class AdminController{
    private adminService:IAdminServices

    constructor(adminService:IAdminServices){
        this.adminService = adminService
    }

    login = catchAsync(async(req:Request,res:Response)=>{
        try {
           const {email,password}=req.body 
           console.log("admin login",email,password)
           const serviceResponse = await this.adminService.login(email,password)
           res.cookie("AdminRefreshToken", serviceResponse.adminRefreshToken, {
            httpOnly: true,
            sameSite: 'none',
            secure: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
         });
         res.cookie("AdminAccessToken", serviceResponse.adminAccessToken, {
            httpOnly: true,
            sameSite: 'none',
            secure: true,
            maxAge: 15 * 60 * 1000,
         });
         res.status(HTTP_statusCode.OK).send(serviceResponse); 
        } catch (error:any) {
            console.log("Admin := login error",error);
            if(error.message === "Invalid email") {
                res.status(HTTP_statusCode.NotFound).json({message : "Email is wrong"})
           } else if(error.message === "Invalid password") {
            res.status(HTTP_statusCode.NotFound).json({message : "password is wrong"})
           }
        }
    })
}
export default AdminController
