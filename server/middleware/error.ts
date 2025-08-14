import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/ErrorHandler";
import logger from "../utils/logger";

export const ErrorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal server error";

  // wrong mongodb id error
  if (err.name === "CastError") {
    const message = `Resource not found. Invalid: ${err.path}`;
    err = new ErrorHandler(message, 400);
  }

  // Duplicate key error
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
    err = new ErrorHandler(message, 400);
  }

  // wrong jwt error
  if (err.name === "JsonWebTokenError") {
    const message = `Json web token is invalid, try again`;
    err = new ErrorHandler(message, 400);
  }

  // JWT expired error
  if (err.name === "TokenExpiredError") {       
    const message = `Json web token is expired, try again`;
    err = new ErrorHandler(message, 400);
  }

  // Log the error details
  logger.error("Unhandled error", {
    statusCode: err.statusCode,
    message: err.message,
    stack: err.stack,
    path: req.originalUrl,
    method: req.method,
    query: req.query,
    body: req.body,
  });

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};
