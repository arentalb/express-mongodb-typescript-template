import { Response } from "express";
import bcrypt from "bcrypt";
import User from "./User";
import AppError from "../../utils/AppError";
import catchAsync from "../../utils/catchAsync";
import { sendSuccess } from "../../utils/AppResponse";
import { AuthenticatedRequest } from "../../interface/AuthenticatedRequest";

export const getProfile = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const user = await User.findById(req.user?.id).select("-password");
    if (!user) {
      throw new AppError("User profile not found", 404);
    }
    sendSuccess(res, user, 200);
  },
);

export const updateProfile = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const { username, email } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user?.id,
      { username, email },
      { new: true, runValidators: true },
    ).select("-password");
    if (!user) {
      throw new AppError("User profile not found", 404);
    }
    sendSuccess(res, user, 200);
  },
);

export const changePassword = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req?.user?.id);
    if (!user) {
      throw new AppError("User profile not found", 404);
    }
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      throw new AppError("Incorrect old password", 401);
    }
    user.password = newPassword;
    await user.validate();
    await user.save();
    sendSuccess(res, "Password changed successfully", 200);
  },
);
