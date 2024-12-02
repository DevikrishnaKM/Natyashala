// src/app.ts
import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectToDB } from './config/db';
import cookieparser from 'cookie-parser';

dotenv.config();  // Load environment variables

const app = express();

app.use(cookieparser());

app.use(cors({ credentials: true, origin: 'http://localhost:5173' }));

app.use(express.json({limit: '10kb'}));


// Connect to the database
connectToDB();

// app.use(cors());
app.use(express.json());  // To parse JSON bodies

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, welcome to Natyashala Backend!');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
