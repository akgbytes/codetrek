import { ApiResponse, asyncHandler, CustomError, logger } from "@repo/utils";
import { handleZodError, validateRegister } from "@repo/zod";
import { db, eq, users } from "@repo/drizzle";
import { RequestHandler } from "express";
import { generateToken, hashPassword } from "../utils/auth";
import { sendVerificationMail } from "../utils/sendMail.ts";

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

  const passwordHash = await hashPassword(password);
  const { unHashedToken, hashedToken, tokenExpiry } = generateToken();

  const [user] = await db
    .insert(users)
    .values({
      email,
      passwordHash,
      fullname,
      verificationToken: hashedToken,
      verificationExpiry: tokenExpiry,
    })
    .returning({
      id: users.id,
      email: users.email,
      fullname: users.fullname,
      avatar: users.avatar,
      role: users.role,
      isVerified: users.isVerified,
    });

  if (!user) {
    logger.error("User insertion failed", { email });
    throw new CustomError(500, "User registration failed. Please try again.");
  }

  await sendVerificationMail(user.fullname, user.email, unHashedToken);

  logger.info("Verification email sent", {
    email,
    userId: user.id,
    ip: req.ip,
  });

  logger.info("User registered successfully", {
    email,
    userId: user.id,
    ip: req.ip,
  });

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Registered Successfully. Please verify your email.",
        user
      )
    );
});
