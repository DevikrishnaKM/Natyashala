import {Router} from "express"
import AdminController from "../controllers/adminController"
import AdminService from "../services/adminService"
import AdminRepository from "../repository/adminRepository"
import userSchema from "../models/userSchema"
import TutorApplication from "../models/applicationModel"
import categoryModel from "../models/categoryModel"
import AuthRepository from "../repository/authRepository"

const route = Router()

const adminRepository = new AdminRepository(userSchema,TutorApplication,categoryModel)
const authRepository = new AuthRepository(userSchema)
const adminService = new AdminService(adminRepository,authRepository)
const adminController = new AdminController(adminService)

route.post("/adminlogin",adminController.login.bind(adminController))
route.get('/getusers' , adminController.getUsers.bind(adminController))
route.patch('/blockuser/:email', adminController.blockUser.bind(adminController))
route.patch('/unblockuser/:email', adminController.unblockUser.bind(adminController));
route.get('/getapplications', adminController.getApplications.bind(adminController))
route.get('/applicationview/:id' , adminController.findApplication.bind(adminController))
route.post('/acceptapplication/:id', adminController.acceptApplication.bind(adminController))
route.get('/check-tutorstatus/:email', adminController.checkTutorStatus.bind(adminController))
route.get('/getTutors' , adminController.getTutors.bind(adminController)) 
route.post('/createcategory', adminController.createCategory.bind(adminController))
route.get('/categories' ,adminController.getCategories.bind(adminController))

export default route