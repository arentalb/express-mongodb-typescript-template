import { Request, Response } from "express";
import bcrypt from "bcrypt";
import catchAsync from "../../../utils/catchAsync";
import AppError from "../../../utils/AppError";
import User from "../User";
import createToken from "../../../utils/createToken";
import { sendSuccess } from "../../../utils/AppResponse";

export const register = catchAsync(async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new AppError("User already exists with that email", 409);
  }

  await User.create({ username, email, password });
  sendSuccess(res, "User registered", 201);
});

export const login = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new AppError("Please provide all inputs", 400);
  }

  const existingUser = await User.findOne({ email });
  const isPasswordValid = await bcrypt.compare(
    password,
    existingUser?.password || "test",
  );

  if (!existingUser || !isPasswordValid) {
    throw new AppError("Wrong credentials", 404);
  }

  const { accessToken } = createToken(existingUser._id);
  await existingUser.save();

  const userResponse = {
    username: existingUser.username,
    email: existingUser.email,
    role: existingUser.role,
    accessToken,
  };
  sendSuccess(res, userResponse, 200);
});

export const logout = catchAsync(async (req: Request, res: Response) => {
  sendSuccess(res, "Logout successfully", 200);
});

export default {
  register,
  logout,
  login,
};
