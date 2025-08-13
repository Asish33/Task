import express from "express";
import type { Request, Response } from "express";
import { connectDB } from "./config/db.js";
import { CarModel } from "./models/User.js";
import jwt, { type Secret } from "jsonwebtoken";
import dotenv from "dotenv";
import { userModel } from "./models/User.js";
dotenv.config();

const app = express();
app.use(express.json());

await connectDB();

app.post("/signup", async (req: Request, res: Response) => {
  try {
    const details = req.body;

    if (!details) {
      return res.status(400).json({ message: "Please provide details" });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res.status(500).json({ message: "JWT secret is not defined" });
    }

    const checking = await userModel.findOne({
      email: details.email,
    });

    if (checking) {
      return res.json({
        message: "user already exists",
      });
    }

    const user = await userModel.create(details);

    const payload = { email: user.email, id: user._id };
    const token = jwt.sign(payload, secret);

    res.json({ token });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

app.post("/login", async (req: Request, res: Response) => {
  try {
    const token = req.headers.token as string | undefined;

    if (!token) {
      return res.status(401).json({ message: "You are not authenticated." });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res.status(500).json({ message: "JWT secret is not defined." });
    }

    const decoded = jwt.verify(token, secret as Secret) as { email: string };

    const userdetails = await userModel.findOne({ email: decoded.email });
    if (!userdetails) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({ message: "User authenticated.", userdetails });
  } catch (err) {
    res.status(401).json({ message: "Invalid token.", error: err });
  }
});

app.post("/cars", async (req: Request, res: Response) => {
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

app.get("/cars", async (req: Request, res: Response) => {
  try {
    const response = await CarModel.find();
    res.json(response);
  } catch (e: any) {
    console.error("error while fetching the data" + e.message);
  }
});

app.post("/carname", async (req: Request, res: Response) => {
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
