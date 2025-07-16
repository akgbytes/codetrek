import { asyncHandler } from "@repo/utils";
import { RequestHandler } from "express";
import jwt, { TokenExpiredError } from "jsonwebtoken";
import { ApiError } from "@repo/utils";
import { decodedUser } from "../types/index";
import { db, eq, users } from "@repo/drizzle";
import { env } from "@repo/zod";

export const isLoggedIn: RequestHandler = asyncHandler(
  async (req, res, next) => {
    const { accessToken } = req.cookies;
    if (!accessToken) throw new ApiError(401, "Access token missing");
    try {
      const decoded = jwt.verify(
        accessToken,
        env.ACCESS_TOKEN_SECRET
      ) as decodedUser;

      const [user] = await db
        .select({
          id: users.id,
          email: users.email,
          role: users.role,
        })
        .from(users)
        .where(eq(users.id, decoded.id));

      if (!user) {
        throw new ApiError(400, "User not found");
      }

      req.user = user;
      next();
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new ApiError(401, "Access token expired");
      }
      throw new ApiError(401, "Invalid or expired access token");
    }
  }
);
