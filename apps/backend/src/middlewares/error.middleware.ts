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

  // Drizzle errors
  if (error?.query && error?.cause) {
    const dbErrorMessage =
      error.cause?.message || error.message || "Database error";
    const dbCode = error.cause?.code || 500;

    apiError = new ApiError(500, dbErrorMessage);
    logError(apiError, req, {
      query: error.query,
      params: error.params,
      code: dbCode,
    });
  } else if (error instanceof ApiError) {
    apiError = error;
    logError(apiError, req);
  } else {
    apiError = new ApiError(500, error.message || "Internal Server Error");
    logError(apiError, req);
  }

  res.status(apiError.code).json({
    code: apiError.code,
    message: apiError.message,
    data: apiError.data,
    success: apiError.success,
  });
};

function logError(error: any, req: Request, extra?: Record<string, any>) {
  const lines = [
    `${error.message}`,
    `Path   : ${req.path}`,
    `Method : ${req.method}`,
    `IP     : ${req.ip}`,
  ];

  if (extra) {
    for (const [key, value] of Object.entries(extra)) {
      lines.push(
        `${key.padEnd(7)}: ${typeof value === "object" ? JSON.stringify(value, null, 2) : value}`
      );
    }
  }

  // lines.push(`Stack  : ${error.stack || "No stack trace"}`);

  logger.error(lines.join("\n"));
}
