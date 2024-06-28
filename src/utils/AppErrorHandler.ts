import { NextFunction, Request, Response } from "express";
import AppError from "./AppError";
import createLogger from "./logger";

const logger = createLogger("error-handler");

const handleCastErrorDB = (err: any): AppError => {
  const message = `Invalid ${err.path} : ${err.value}`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err: any): AppError => {
  const errors = Object.values(err.errors).map((el: any) => el.message);
  const message = `Invalid input -> ${errors.join(" || ")}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err: any): AppError => {
  const { keyValue } = err;
  const key = Object.keys(keyValue)[0];
  const value = keyValue[key];

  const message = `Duplicate field ${key} : ${value}`;
  return new AppError(message, 400);
};

const handleInvalidToken = (): AppError => {
  return new AppError("Invalid Token", 400);
};

const handleTokenExpiration = (): AppError => {
  return new AppError("Your token has expired", 403);
};

const sendErrorDev = (err: any, res: Response) => {
  logger.error(err);
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
    error: err,
  });
};

const sendErrorProd = (err: any, res: Response) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    logger.error("ERROR 💥", err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export default (err: any, req: Request, res: Response, next: NextFunction) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    if (err.name === "CastError") {
      err = handleCastErrorDB(err);
    }
    if (err.name === "ValidationError") {
      err = handleValidationErrorDB(err);
    }
    if (err.code === 11000) {
      err = handleDuplicateFieldsDB(err);
    }
    if (err.name === "JsonWebTokenError") {
      err = handleInvalidToken();
    }
    if (err.name === "TokenExpiredError") {
      err = handleTokenExpiration();
    }

    sendErrorProd(err, res);
  }
};
