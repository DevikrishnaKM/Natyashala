import { Router } from "express";
import TutorController from "../controllers/tutorController";
import TutorService from "../services/tutorService";
import AuthRepository from "../repository/authRepository";
import AdminRepository from "../repository/adminRepository";
import userSchema from "../models/userSchema"
import TutorApplication from "../models/applicationModel";
import categoryModel from "../models/categoryModel"
import TutorRepository from "../repository/tutorRepository";
import multer from "multer";

const route = Router();
const authRepository= new AuthRepository(userSchema)
const tutorRepository = new TutorRepository(userSchema)
const adminRepository = new AdminRepository(userSchema,TutorApplication,categoryModel)
const tutorService = new TutorService(authRepository,adminRepository,tutorRepository)
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

export default route;