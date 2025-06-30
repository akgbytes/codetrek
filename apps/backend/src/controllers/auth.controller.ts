import { ApiResponse, asyncHandler, CustomError, logger } from "@repo/utils";
import { handleZodError, validateRegister } from "@repo/zod";
import { db, eq, users } from "@repo/drizzle";
import { RequestHandler } from "express";
import { generateToken, hashPassword } from "../utils/auth";

export const register: RequestHandler = asyncHandler(async (req, res) => {
  const { email, password, fullname } = handleZodError(
    validateRegister(req.body)
  );

  logger.info("Registration attempt", { email, ip: req.ip });

  const [existingUser] = await db
    .select()
    .from(users)
    .where(eq(users.email, email));

  if (existingUser) {
    throw new CustomError(409, "Email is already registered");
  }

  const hashedPassword = await hashPassword(password);
  const { unHashedToken, hashedToken, tokenExpiry } = generateToken();

  const user = await db.insert(users).values({
    email,
    password: hashedPassword,
    fullname,
    emailVerificationToken: hashedToken,
    emailVerificationExpiry: tokenExpiry,
  });
});
