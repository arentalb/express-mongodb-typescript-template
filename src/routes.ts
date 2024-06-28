import express, { NextFunction, Request, Response } from "express";
import AppError from "./utils/AppError";
import userRoutes from "./features/user/userRoutes";
import authRoutes from "./features/user/auth/authRoutes";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/user", userRoutes);

router.all("*", (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Cannot find ${req.originalUrl} on this server`, 404));
});

export default router;
