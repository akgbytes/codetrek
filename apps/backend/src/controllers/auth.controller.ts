import { ApiResponse, asyncHandler, CustomError, logger } from "@repo/utils";
import { handleZodError, validateRegister } from "@repo/zod";
import { and, db, eq, gt, users } from "@repo/drizzle";
import { RequestHandler } from "express";
import {
  createHash,
  generateAccessToken,
  generateRefreshToken,
  generateToken,
  hashPassword,
} from "../utils/auth";
import { sendVerificationMail } from "../utils/sendMail";
import { emailQueue } from "../queues/email.queue";
import { generateCookieOptions } from "../configs/cookie";

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
      verificationTokenExpiry: tokenExpiry,
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

  emailQueue.add("sendVerifyEmail", {
    type: "verify",
    fullname: user.fullname,
    email: user.email,
    token: unHashedToken,
  });

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

export const verifyEmail: RequestHandler = asyncHandler(async (req, res) => {
  const { token } = req.params;

  if (!token) throw new CustomError(400, "Verification token is required");

  const hashedToken = createHash(token);

  const [user] = await db
    .select()
    .from(users)
    .where(
      and(
        eq(users.verificationToken, hashedToken),
        gt(users.verificationTokenExpiry, new Date())
      )
    );

  if (!user) {
    throw new CustomError(
      410,
      "The verification link is invalid or has expired"
    );
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  const hashedRefreshToken = createHash(refreshToken);

  await db
    .update(users)
    .set({
      isVerified: true,
      verificationToken: null,
      verificationTokenExpiry: null,
      refreshToken: hashedRefreshToken,
    })
    .where(eq(users.id, user.id));

  logger.info("Email verified successfully", {
    email: user.email,
    userId: user.id,
    ip: req.ip,
  });

  res
    .status(200)
    .cookie("accessToken", accessToken, generateCookieOptions())
    .cookie("refreshToken", refreshToken, generateCookieOptions())
    .json(new ApiResponse(200, "Email verified successfully", null));
});
