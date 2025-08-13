import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import type { Request } from "express";

export const carCreateLimiter = rateLimit({
  windowMs: 60 * 1000, 
  max: 5,
  handler: (req, res) => {
    console.log("Rate limit exceeded");
    res.status(429).json({ message: "Too many requests" });
  },
  keyGenerator: (req: Request) => {
    return ipKeyGenerator(req.ip ?? ""); 
  },
});
