// src/app.ts
import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectToDB } from './config/db';
import cookieparser from 'cookie-parser';
import morgan from 'morgan';
import AppError from './utils/appError';
import errorController from './controllers/errorController';
import authRouter from './routes/authRoutes';
import adminRouter from "./routes/adminRoutes"
import tutorRouter from "./routes/tutorRoutes"
import { asyncContextMiddleware } from './config/awsFileConfig';

dotenv.config();  // Load environment variables

connectToDB();
const app = express();

app.use(morgan('dev'))
app.use(cors({ credentials: true, origin: 'http://localhost:5173' }));
app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
  next();
});

app.use(asyncContextMiddleware);
app.use(cookieparser());
app.use(express.json({limit: '5gb'}));
app.use(express.urlencoded({ limit: '5gb', extended: true }));
app.use('/auth', authRouter);
app.use('/admin', adminRouter);
app.use('/tutor', tutorRouter);

app.all('*', (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(errorController);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
