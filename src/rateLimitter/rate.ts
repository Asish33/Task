
import rateLimit from "express-rate-limit";

export const carCreateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5, 
  message: {
    message: "Too many requests, please try again later.",
  },
  keyGenerator: (req: any) => req.user?._id?.toString() || req.ip,
  standardHeaders: true,
  legacyHeaders: false,
});
