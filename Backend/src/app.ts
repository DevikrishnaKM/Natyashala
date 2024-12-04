// src/app.ts
import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectToDB } from './config/db';
import cookieparser from 'cookie-parser';

import AppError from './utils/appError';
import errorController from './controllers/errorController';
import authRouter from './routes/authRoutes';

dotenv.config();  // Load environment variables

const app = express();

app.use(cookieparser());

app.use(cors({ credentials: true, origin: 'http://localhost:5173' }));

app.use(express.json({limit: '10kb'}));


// Connect to the database
connectToDB();

// app.use(cors());
app.use(express.json());  // To parse JSON bodies

app.use('/auth', authRouter);

app.all('*', (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(errorController);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
