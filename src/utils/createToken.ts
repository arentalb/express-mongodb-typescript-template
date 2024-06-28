import jwt from "jsonwebtoken";
import mongoose from "mongoose";

interface TokenPayload {
  id: string;
}

interface TokenResult {
  accessToken: string;
  refreshToken: string;
}

const createToken = (userId: mongoose.Types.ObjectId): TokenResult => {
  const accessToken = jwt.sign(
    { id: userId },
    process.env.JWT_SECRET as string,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    },
  );

  const refreshToken = jwt.sign(
    { id: userId },
    process.env.JWT_REFRESH_SECRET as string,
    {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
    },
  );

  return { accessToken, refreshToken };
};

export default createToken;
