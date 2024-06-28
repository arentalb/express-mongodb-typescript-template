import { NextFunction, Response } from "express";
import AppError from "../utils/AppError";
import catchAsync from "../utils/catchAsync";
import { AuthenticatedRequest } from "../interface/AuthenticatedRequest";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../features/user/User";

export const authenticate = catchAsync(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    let token: string = "";

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      throw new AppError("You are not logged in, please log in first!", 401);
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as JwtPayload;

    const freshUser = await User.findById(decoded.id);
    if (!freshUser) {
      throw new AppError("The token owner no longer exists", 401);
    }

    req.user = { id: freshUser._id.toString(), role: freshUser.role };
    next();
  },
);

export const authorizeTo = (...roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      throw new AppError("You don't have permission for this operation", 403);
    }
    next();
  };
};
