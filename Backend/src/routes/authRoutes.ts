import express from 'express';
import AuthController from '../controllers/authController'; // Default export: Adjust capitalization if using PascalCase for classes
import AuthService from '../services/authService'; // Default export
import AuthRepository from '../repository/authRepository'; // Default export
import userSchema from '../models/userSchema'; // Model schema
import AdminRepository from "../repository/adminRepository";
import TutorApplication from "../models/applicationModel";
import categoryModel from "../models/categoryModel"
import { Course } from "../models/courseModel";
import { refreshTokenHandler } from "../config/refreshTokenVerify";
import { verifyToken } from "../config/jwtConfig";
import multer from "multer";
import { CourseRepository } from "../repository/courseRepository";


// import userAuth from "../config/userAuth";

const router = express.Router();

// Initialize dependencies
const authRepository = new AuthRepository(userSchema,Course); 
const courseRepository = new CourseRepository()
const adminRepository = new AdminRepository(userSchema,TutorApplication,categoryModel,Course)
const authService = new AuthService(authRepository,adminRepository,courseRepository);  
const authController = new AuthController(authService); 
const storage = multer.memoryStorage()
const upload = multer({
    storage,
    limits:{
        fileSize:5*1024*1024
    },
})

// Define routes
router.post('/signup', authController.createUser.bind(authController)); // Correctly bind `createUser`
router.post('/otpVerification', authController.otpVerification.bind(authController));
router.post("/verifyLogin",authController.verifyLogin.bind(authController))
router.post('/resendOtp', authController.resendOtp.bind(authController));
router.put('/editUser', verifyToken ,authController.editUser.bind(authController));
router.post('/save-userProfile',verifyToken,upload.single('profileImage'), authController.saveProfilePic.bind(authController));
router.get('/getProfile/:email' ,verifyToken, authController.getProfile.bind(authController))
router.post('/refresh-token', refreshTokenHandler);

router.get('/get-courses', authController.getCourses.bind(authController));
router.get("/getCourse/:id", verifyToken, authController.courseDetails.bind(authController));
router.get('/check-enrollment/:email/:courseId', verifyToken,authController.checkEnrollement.bind(authController));
router.post('/createorder',verifyToken,authController.createOrder.bind(authController))
router.post('/checkSessionStatus',verifyToken,authController.confirmPayment.bind(authController))
router.get("/tutorDetail/:id",verifyToken,authController.tutorDetail.bind(authController))

export default router;
