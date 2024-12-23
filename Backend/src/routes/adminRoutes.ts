import {Router} from "express"
import AdminController from "../controllers/adminController"
import AdminService from "../services/adminService"
// import AdminRepository from "../repository/adminRepository"
// import userSchema from "../models/userSchema"

const route = Router()

// const adminRepository = new AdminRepository(userSchema)
const adminService = new AdminService()
const adminController = new AdminController(adminService)

route.post("/adminlogin",adminController.login.bind(adminController))

export default route