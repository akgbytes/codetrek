import jwt from "jsonwebtoken";
import { ApiResponse, asyncHandler, ApiError, logger } from "@repo/utils";
import {
  env,
  handleZodError,
  validateEmail,
  validateLogin,
  validateRegister,
  validateResetPassword,
} from "@repo/zod";
import { and, db, eq, gt, users } from "@repo/drizzle";
import { RequestHandler } from "express";
import {
  createHash,
  generateAccessToken,
  generateRefreshToken,
  generateToken,
  hashPassword,
  passwordMatch,
} from "../utils/auth";
import { sendVerificationMail } from "../utils/sendMail";
import { emailQueue } from "../queues/email.queue";
import { generateCookieOptions } from "../configs/cookie";
import { verifyGoogleToken } from "../utils/auth/verifyGoogleToken";

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
    throw new ApiError(409, "Email is already registered.");
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
    throw new ApiError(500, "User registration failed. Please try again.");
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

export const login: RequestHandler = asyncHandler(async (req, res) => {
  const { email, password } = handleZodError(validateLogin(req.body));

  const [user] = await db.select().from(users).where(eq(users.email, email));

  if (!user) throw new ApiError(401, "Invalid credentials.");

  const isPasswordCorrect = await passwordMatch(password, user.passwordHash!);
  if (!isPasswordCorrect) throw new ApiError(401, "Invalid credentials.");

  if (!user.isVerified) {
    throw new ApiError(401, "Please verify your email first.");
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  const hashedRefreshToken = createHash(refreshToken);

  await db
    .update(users)
    .set({
      refreshToken: hashedRefreshToken,
    })
    .where(eq(users.id, user.id));

  logger.info("User logged in successfully", {
    email,
    userId: user.id,
    ip: req.ip,
  });

  res
    .status(200)
    .cookie("accessToken", accessToken, generateCookieOptions())
    .cookie("refreshToken", refreshToken, generateCookieOptions())
    .json(new ApiResponse(200, "Logged in successfully.", null));
});

export const logout: RequestHandler = asyncHandler(async (req, res) => {
  const { refreshToken } = req.cookies;
  const { id, email } = req.user;

  if (!refreshToken) {
    throw new ApiError(400, "Refresh token is missing.");
  }

  await db
    .update(users)
    .set({
      refreshToken: null,
    })
    .where(eq(users.id, id));

  logger.info("User logged out successfully", {
    email,
    userId: id,
    ip: req.ip,
  });

  res
    .status(200)
    .clearCookie("accessToken", {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "strict",
    })
    .clearCookie("refreshToken", {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "strict",
    })
    .json(new ApiResponse(200, "Logged out successfully.", null));
});

export const verifyEmail: RequestHandler = asyncHandler(async (req, res) => {
  const { token } = req.params;

  if (!token) throw new ApiError(400, "Verification token is required");

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
    throw new ApiError(410, "The verification link is invalid or has expired");
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

export const resendVerificationEmail: RequestHandler = asyncHandler(
  async (req, res) => {
    const { email } = handleZodError(validateEmail(req.body));

    const [user] = await db.select().from(users).where(eq(users.email, email));

    if (!user) {
      throw new ApiError(401, "No account found with this email address.");
    }

    if (user.isVerified) {
      throw new ApiError(400, "Email is already verified.");
    }

    const { unHashedToken, hashedToken, tokenExpiry } = generateToken();

    await db
      .update(users)
      .set({
        verificationToken: hashedToken,
        verificationTokenExpiry: tokenExpiry,
      })
      .where(eq(users.email, email));

    emailQueue.add("sendVerifyEmail", {
      type: "verify",
      fullname: user.fullname,
      email: user.email,
      token: unHashedToken,
    });

    logger.info("Verification email resent", {
      email,
      userId: user.id,
      ip: req.ip,
    });

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "Verification mail sent successfully. Please check your inbox.",
          null
        )
      );
  }
);

export const forgotPassword: RequestHandler = asyncHandler(async (req, res) => {
  const { email } = handleZodError(validateEmail(req.body));

  const [user] = await db.select().from(users).where(eq(users.email, email));

  if (!user) {
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "If an account exists, a reset link has been sent to the email",
          null
        )
      );
  }

  if (user.provider !== "LOCAL") {
    return res.status(200).json(
      new ApiResponse(
        200,
        `You signed up using ${user.provider}. Please use ${user.provider} Sign-In to access your account.`,
        {
          code: "OAUTH_USER",
        }
      )
    );
  }

  const { unHashedToken, hashedToken, tokenExpiry } = generateToken();

  await db
    .update(users)
    .set({ resetPasswordToken: hashedToken, resetPasswordExpiry: tokenExpiry })
    .where(eq(users.id, user.id));

  emailQueue.add("sendResetEmail", {
    type: "reset",
    fullname: user.fullname,
    email: user.email,
    token: unHashedToken,
  });

  logger.info("Password reset email sent", {
    email: user.email,
    userId: user.id,
    ip: req.ip,
  });

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "If an account exists, a reset link has been sent to the email",
        null
      )
    );
});

export const resetPassword: RequestHandler = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = handleZodError(validateResetPassword(req.body));

  if (!token) {
    throw new ApiError(400, "Password reset token is missing.");
  }

  const hashedToken = createHash(token);

  const [user] = await db
    .select()
    .from(users)
    .where(
      and(
        eq(users.resetPasswordToken, hashedToken),
        gt(users.resetPasswordExpiry, new Date())
      )
    );

  if (!user) {
    throw new ApiError(410, "Reset link has expired or is invalid.");
  }

  const isSame = await passwordMatch(password, user.passwordHash!);
  if (isSame) {
    throw new ApiError(400, "Password must be different from old password.");
  }

  const hashedPassword = await hashPassword(password);

  await db
    .update(users)
    .set({
      passwordHash: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpiry: null,
    })
    .where(eq(users.id, user.id));

  logger.info("Password reset successful", {
    email: user.email,
    userId: user.id,
    ip: req.ip,
  });

  res
    .status(200)
    .json(new ApiResponse(200, "Password reset successfully.", null));
});

export const refreshAccessToken: RequestHandler = asyncHandler(
  async (req, res) => {
    const { refreshToken: incomingRefreshToken } = req.cookies;
    if (!incomingRefreshToken) {
      throw new ApiError(401, "Refresh token is missing.");
    }

    const user = req.user;
    let decoded;
    try {
      decoded = jwt.verify(incomingRefreshToken, env.REFRESH_TOKEN_SECRET);
    } catch (err) {
      throw new ApiError(401, "Invalid or expired refresh token");
    }

    const hashedIncoming = createHash(incomingRefreshToken);

    const [isRefreshTokenValid] = await db
      .select()
      .from(users)
      .where(eq(users.refreshToken, hashedIncoming));

    if (!isRefreshTokenValid) {
      throw new ApiError(401, "Refresh token has been used or is invalid.");
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    const newHashed = createHash(refreshToken);

    await db
      .update(users)
      .set({ refreshToken: newHashed })
      .where(eq(users.refreshToken, newHashed));

    logger.info("Access token refreshed");

    res
      .status(200)
      .cookie("accessToken", accessToken, generateCookieOptions())
      .cookie("refreshToken", refreshToken, generateCookieOptions())
      .json(new ApiResponse(200, "Access token refreshed successfully", null));
  }
);

export const googleLogin: RequestHandler = asyncHandler(async (req, res) => {
  const { token } = req.body;

  const payload = await verifyGoogleToken(token);

  const { email, name, picture } = payload;

  if (!email || !name || !picture) {
    throw new ApiError(200, "");
  }

  const [existingUser] = await db
    .select({
      id: users.id,
      email: users.email,
      fullname: users.fullname,
      avatar: users.avatar,
      role: users.role,
      isVerified: users.isVerified,
    })
    .from(users)
    .where(eq(users.email, email));

  let user = existingUser;

  if (!existingUser) {
    const [newUser] = await db
      .insert(users)
      .values({
        email,
        fullname: name,
        avatar: picture,
        isVerified: true,
        provider: "GOOGLE",
      })
      .returning({
        id: users.id,
        email: users.email,
        fullname: users.fullname,
        avatar: users.avatar,
        role: users.role,
        isVerified: users.isVerified,
      });

    user = newUser;
  }

  const accessToken = generateAccessToken(user!);
  const refreshToken = generateRefreshToken(user!);
  const hashedRefreshToken = createHash(refreshToken);

  await db
    .update(users)
    .set({ refreshToken: hashedRefreshToken })
    .where(eq(users.id, user!.id));

  logger.info(`${email} logged in via Google`);

  res
    .status(200)
    .cookie("accessToken", accessToken, generateCookieOptions())
    .cookie("refreshToken", refreshToken, generateCookieOptions())
    .json(new ApiResponse(200, "Logged in via Google successfully", null));
});

export const getProfile: RequestHandler = asyncHandler(async (req, res) => {
  const { id } = req.user;
  const [user] = await db
    .select({
      id: users.id,
      email: users.email,
      fullname: users.fullname,
      avatar: users.avatar,
      role: users.role,
      isVerified: users.isVerified,
    })
    .from(users)
    .where(eq(users.id, id));

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  logger.info("User profile fetched", {
    email: user.email,
    userId: user.id,
    ip: req.ip,
  });

  res
    .status(200)
    .json(new ApiResponse(200, "User profile fetched successfully", user));
});
