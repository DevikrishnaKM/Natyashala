import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { createToken } from './jwtConfig';

dotenv.config();

const secret_key = process.env.JWT_SECRET as string;

const refreshTokenHandler = (req: Request, res: Response, next: NextFunction): void => {
  const { userId } = req.body;

  if (!userId) {
    res.status(400).json({ message: "User ID is required." });
    return;
  }

  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    res.status(401).json({ message: "Refresh token is missing." });
    return;
  }

  jwt.verify(refreshToken, secret_key, (err: jwt.VerifyErrors | null) => {
    if (err) {
      console.error("Error verifying refresh token:", err.message);
      res.status(401).json({ message: "Invalid or expired refresh token." });
      return;
    }

    // Generate a new access token
    const newAccessToken = createToken(userId, "User");
    res.json({ accessToken: newAccessToken });
  });
};

export { refreshTokenHandler };
