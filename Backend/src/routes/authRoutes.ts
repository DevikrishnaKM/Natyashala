import express from 'express';
import AuthController from '../controllers/authController'; // Default export: Adjust capitalization if using PascalCase for classes
import AuthService from '../services/authService'; // Default export
import AuthRepository from '../repository/authRepository'; // Default export
import userSchema from '../models/userSchema'; // Model schema

const router = express.Router();

// Initialize dependencies
const authRepository = new AuthRepository(userSchema); // Use `new` for instantiating the repository
const authService = new AuthService(authRepository);   // Inject repository into service
const authController = new AuthController(authService); // Inject service into controller

// Define routes
router.post('/signup', authController.createUser.bind(authController)); // Correctly bind `createUser`
router.post('/otpVerification', authController.otpVerification.bind(authController));
router.post("/verifyLogin",authController.verifyLogin.bind(authController))


export default router;
