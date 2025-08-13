import type { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import jwt, { type Secret, type JwtPayload } from "jsonwebtoken";
import { userModel } from "../models/User.js";

dotenv.config();

const middleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.token;

    if (!token) {
      return res.status(401).json({ message: "You are not authenticated. Please login again." });
    }

    const secret = process.env.JWT_SECRET as Secret;
    const data = jwt.verify(token as string, secret) as JwtPayload;

    const user = await userModel.findOne({ email: data.email });
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    (req as any).user = user;

    next();
  } catch (error: any) {
    res.status(401).json({ message: "Invalid token", error: error.message });
  }
};

export default middleware;
