import express from "express";
import type { Request, Response } from "express";
import { connectDB } from "./config/db.js";
import { CarModel } from "./models/User.js";

const app = express();
app.use(express.json());

await connectDB();

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

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
