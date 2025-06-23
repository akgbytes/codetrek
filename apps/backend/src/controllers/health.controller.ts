import { ApiResponse, asyncHandler } from "@repo/utils";
import { RequestHandler } from "express";

export const healthCheck: RequestHandler = asyncHandler(async (req, res) => {
  res.status(200).json(new ApiResponse(200, "Health check passed", null));
});
