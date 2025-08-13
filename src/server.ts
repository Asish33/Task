import express from "express";
import type { Request, Response } from "express";
import { connectDB } from "./config/db.js";
const app = express();

await connectDB();

app.get("/testing", (req: Request, res: Response) => {
  res.json({
    message: "hi",
  });
});

app.listen(3000, () => {
  console.log(`server is running on the port 3000`);
});
