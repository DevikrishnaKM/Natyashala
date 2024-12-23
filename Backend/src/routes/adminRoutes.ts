import {Router} from "express"
import AdminController from "../controllers/adminController"
import AdminService from "../services/adminService"
import AdminRepository from "../repository/adminRepository"
import userSchema from "../models/userSchema"

const route = Router()

const adminRepository = new AdminRepository(userSchema)
const adminService = new AdminService(adminRepository)
const adminController = new AdminController(adminService)

route.post("/adminlogin",adminController.login.bind(adminController))
route.get('/getusers' , adminController.getUsers.bind(adminController))
route.patch('/blockuser/:email', adminController.blockUser.bind(adminController))
route.patch('/unblockuser/:email', adminController.unblockUser.bind(adminController));
export default route