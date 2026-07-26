import { NextFunction, Request, Response } from "express";
import multer from "multer";
import { AppError } from "../errors/app_error";

export const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction): void => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      res.status(400).json({
        message: "Image too large. Maximum file size is 5MB"
      });
      return;
    }

    res.status(400).json({
      message: err.message
    });
    return;
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      message: err.message
    });
    return;
  }

  res.status(500).json({
    message: "Internal server error"
  });
};
