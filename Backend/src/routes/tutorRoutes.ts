import { Router } from "express";
import TutorController from "../controllers/tutorController";
import TutorService from "../services/tutorService";
import AuthRepository from "../repository/authRepository";
import AdminRepository from "../repository/adminRepository";
import userSchema from "../models/userSchema"
import { Course } from "../models/courseModel";
import TutorApplication from "../models/applicationModel";
import categoryModel from "../models/categoryModel"
import TutorRepository from "../repository/tutorRepository";
import multer from "multer";
import  { CourseRepository }  from "../repository/courseRepository";
import Report from "../models/reportModel"

const route = Router();
const authRepository= new AuthRepository(userSchema,Course)
const tutorRepository = new TutorRepository(userSchema,Course)
const adminRepository = new AdminRepository(userSchema,TutorApplication,categoryModel,Course,Report)
const courseRepository = new CourseRepository()
const tutorService = new TutorService(authRepository,adminRepository,tutorRepository,courseRepository)
const tutorController = new TutorController(tutorService);

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 * 1024, 
    fieldSize: 10 * 1024 * 1024,     
  },
});

const multerFields = [
    { name: 'idProof', maxCount: 1 },
    { name: 'resume', maxCount: 1 },
    { name: 'certifications', maxCount: 10 },
];


route.post("/tutorapplication", upload.fields(multerFields),tutorController.tutorApplication.bind(tutorController));
route.get('/applicationdata/:email' , tutorController.getTutorDetails.bind(tutorController))
route.post('/editprofile' , tutorController.editProfile.bind(tutorController))
route.post('/create-course/:email', upload.any() ,tutorController.createCourse.bind(tutorController))
route.get('/get-courses/:email', tutorController.getCourses.bind(tutorController))
route.put('/updateCourse/:courseId' ,tutorController.updateCourse.bind(tutorController))
route.put('/updateVideo/:courseId', tutorController.editVideo.bind(tutorController))
route.delete('/deleteVideo', tutorController.deleteVideo.bind(tutorController))
route.post('/add-video/:sectionId', upload.single("file"), tutorController.addVideo.bind(tutorController))
route.get('/tutorDashboard/:email', tutorController.getDashboard.bind(tutorController))
route.get('/chart', tutorController.ChartData.bind(tutorController))

export default route;