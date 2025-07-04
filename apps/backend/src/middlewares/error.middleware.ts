import { ApiError, logger } from "@repo/utils";
import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.log("error from middleware: ", error);
  let apiError: ApiError;

  if (error instanceof ApiError) {
    apiError = error;
  } else {
    apiError = new ApiError(500, error.message || "Internal Server Error");
  }

  logger.error(apiError.message, {
    path: req.path,
    method: req.method,
    ip: req.ip,
    stack: apiError.stack || "",
  });

  res.status(apiError.code).json({
    code: apiError.code,
    message: apiError.message,
    data: apiError.data,
    success: apiError.success,
  });
};
