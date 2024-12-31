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
    getUsers = catchAsync(async(req:Request,res:Response)=>{
        try {
           
            const page=parseInt(req.query.page as string,10)||1
            const limit=parseInt(req.query.limit as string,10)||10
            const {users,total}=await this.adminService.getUsersList(page,limit)
            console.log(users,total)
            res.status(200).json({
                users,
                total,
                currentPage: page,
                totalPages: Math.ceil(total / limit),
            });
        } catch (error:any) {
            console.log("Admin := getusers error",error);
        if(error.message === 'Invalid page number') {
            res.status(HTTP_statusCode.BadRequest).json({message : "Invalid page number"})
        } else if (error.message === 'Invalid limit value') {
            res.status(HTTP_statusCode.BadRequest).json({message : 'Invalid limit value'})
        }
        res.status(HTTP_statusCode.InternalServerError).json({ message: error.message });
        }
        
    })
    blockUser = async(req : Request , res : Response) => {
        try {
           const { email } = req.params 
            const status = await this.adminService.blockUser(email)
            res.status(HTTP_statusCode.updated).json(status)
        } catch (error : any) {
            console.log("Admin := getusers error in controller",error);
            if(error.message === 'User not found') {
                res.status(HTTP_statusCode.NotFound).json({message : 'User not found'})
            } else if(error.message === 'User is already blocked') {
                res.status(HTTP_statusCode.NotFound).json({message : 'User is already blocked'})
            }
            res.status(HTTP_statusCode.InternalServerError).json({ message: error.message });
        }
    } 
    unblockUser = async(req : Request , res : Response) => {
        try {
           const { email } = req.params 
            const status = await this.adminService.unBlockUser(email)
            res.status(HTTP_statusCode.updated).json(status)
        } catch (error : any) {
            console.log("Admin := getusers error in controller",error);
            if(error.message === 'User not found') {
                res.status(HTTP_statusCode.NotFound).json({message : 'User not found'})
            } else if(error.message === 'User is already unblocked') {
                res.status(HTTP_statusCode.NotFound).json({message : 'User is already unblocked'})
            }
            res.status(HTTP_statusCode.InternalServerError).json({ message: error.message });
        }
    } 
    getApplications = async(req : Request , res : Response) => {
        try {
            const getApplications = await this.adminService.getApplications()
            res.status(HTTP_statusCode.OK).json(getApplications)        
        } catch (error : any ) {
            console.log("Admin := getusers error in controller",error);
            res.status(HTTP_statusCode.InternalServerError).json({ message: error.message });
        }
    }

    findApplication = async(req : Request , res : Response) => {
        try {
            const {id} =  req.params;
            const applicant = await this.adminService.findApplication(id)
            res.status(HTTP_statusCode.OK).json(applicant)
        } catch (error : any) {
            console.log("Admin := getusers error in controller",error);
            res.status(HTTP_statusCode.InternalServerError).json({ message: error.message });
        }
    }

}
export default AdminController
