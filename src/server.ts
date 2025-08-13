import express from "express";
import type { Request, Response } from "express";
import { connectDB } from "./config/db.js";
import { CarModel } from "./models/User.js";
import jwt, { type Secret } from "jsonwebtoken";
import dotenv from "dotenv";
import { userModel } from "./models/User.js";
import middleware from "./middleware/middleware.js";
dotenv.config();

const app = express();
app.use(express.json());

await connectDB();

app.post("/signup", async (req: Request, res: Response) => {
  try {
    const details = req.body;

    if (!details || !details.email || !details.password) {
      return res
        .status(400)
        .json({ message: "Please provide email and password" });
    }

    const existingUser = await userModel.findOne({ email: details.email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    await userModel.create(details);

    res
      .status(201)
      .json({ message: "User created successfully. Please login." });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

app.post("/login", async (req: Request, res: Response) => {
  try {
    const token = req.headers.token?.toString();

    if (!token) {
      return res.status(401).json({ message: "Token is required" });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res.status(500).json({ message: "JWT secret is not defined" });
    }

    const decoded = jwt.verify(token, secret as Secret) as { email: string };
    const userdetails = await userModel.findOne({ email: decoded.email });

    if (!userdetails) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User authenticated", userdetails });
  } catch (err: any) {
    res.status(401).json({ message: "Invalid token", error: err.message });
  }
});

app.post("/cars", middleware, async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const car = await CarModel.create(body);
    res.status(201).json({
      message: "created car successfully.",
    });
  } catch (e: any) {
    res.status(500).json({ message: "Error creating car", error: e.message });
  }
});

app.get("/cars", middleware, async (req: Request, res: Response) => {
  try {
    const response = await CarModel.find();
    res.json(response);
  } catch (e: any) {
    console.error("error while fetching the data" + e.message);
  }
});

app.post("/carname", middleware, async (req: Request, res: Response) => {
  try {
    const body = req.body.carname;
    const response = await CarModel.find({
      model: body,
    });
    res.json({
      response,
    });
  } catch (e: any) {
    console.error("error");
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
