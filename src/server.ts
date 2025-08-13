import express from "express";
import type { Request, Response } from "express";
const app = express();

app.get("/testing", (req: Request, res: Response) => {
    res.json("hello")
});

app.listen(3000, () => {
  console.log(`server is running on the port 3000`);
});
