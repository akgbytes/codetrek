import { CustomError, logger } from "@repo/utils";
import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.log("error from middleware: ", error);
  let customError: CustomError;

  if (error instanceof CustomError) {
    customError = error;
  } else {
    customError = new CustomError(
      500,
      error.message || "Internal Server Error"
    );
  }

  logger.error(customError.message, {
    path: req.path,
    method: req.method,
    ip: req.ip,
    stack: customError.stack || "",
  });

  res.status(customError.code).json({
    code: customError.code,
    message: customError.message,
    data: customError.data,
    success: customError.success,
  });
};
