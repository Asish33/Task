import express from "express";
import type { Request, Response } from "express";
import { connectDB } from "./config/db.js";
import { CarModel } from "./models/User.js";
import jwt, { type Secret } from "jsonwebtoken";
import dotenv from "dotenv";
import { userModel } from "./models/User.js";
import middleware from "./middleware/middleware.js";

export interface AuthenticatedRequest extends Request {
  user?: any;
}




dotenv.config();

const app = express();
app.use(express.json());

await connectDB();

app.post("/signup", async (req: Request, res: Response) => {
  try {
    const details = req.body;

    if (!details || !details.email || !details.password) {
      return res.json({ message: "Please provide email and password" });
    }

    const existingUser = await userModel.findOne({ email: details.email });
    if (existingUser) {
      return res.json({ message: "User already exists" });
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
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide email and password" });
    }

    const user = await userModel.findOne({ email, password });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res.status(500).json({ message: "JWT secret is not defined" });
    }

    const payload = { id: user._id, email: user.email };
    const token = jwt.sign(payload, secret);

    res.status(200).json({ message: "Login successful", token });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});



app.post("/cars", middleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const body = req.body;
    const car = await CarModel.create({
      ... body,
      userId: req.user._id,
    });
    res.status(201).json({
      message: "created car successfully.",
    });
  } catch (e: any) {
    res.status(500).json({ message: "Error creating car", error: e.message });
  }
});



app.get("/cars", middleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const response = await CarModel.find({
      userId:req.user._id,
    });
    res.json(response);
  } catch (e: any) {
    console.error("error while fetching the data" + e.message);
  }
});



app.post("/carname", middleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const body = req.body.carname;
    const response = await CarModel.find({
      model: body,
      userId:req.user._id
    });
    res.json({
      response,
    });
  } catch (e: any) {
    console.error("error");
  }
});



app.post("/carColor", middleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const color = req.body.color;
    const response = await CarModel.find({
      color: color,
      userId:req.user._id
    });
    res.json(response);
  } catch (e) {
    console.error("error while fetching the cars with given color");
  }
});



app.listen(3000, () => {
  console.log("Server running on port 3000");
});
