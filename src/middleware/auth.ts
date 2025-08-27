import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

// Extend Express Request type to include `user`
declare global {
  namespace Express {
    interface Request {
      user?: string | JwtPayload;
    }
  }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(403).json({ message: "A token is required for authentication" });
  }

  try {
    // If using "Bearer <token>" format, split it
    const extractedToken = (token as string).startsWith("Bearer ")
      ? (token as string).split(" ")[1]
      : token;

    const decoded = jwt.verify(extractedToken, JWT_SECRET);
    req.user = decoded;
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }

  next();
};