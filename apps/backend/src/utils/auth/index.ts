import bcrypt from "bcrypt";
import jwt, { SignOptions } from "jsonwebtoken";
import crypto from "crypto";
import { decodedUser } from "../../types";
import { env } from "@repo/zod";

export const hashPassword = async (password: string) =>
  await bcrypt.hash(password, 10);

export const passwordMatch = async (
  enteredPassword: string,
  storedPassword: string
) => bcrypt.compare(enteredPassword, storedPassword);

export const generateAccessToken = (user: decodedUser) =>
  jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    env.ACCESS_TOKEN_SECRET,
    { expiresIn: env.ACCESS_TOKEN_EXPIRY as SignOptions["expiresIn"] }
  );

export const generateRefreshToken = (user: decodedUser) =>
  jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    env.REFRESH_TOKEN_SECRET,
    { expiresIn: env.REFRESH_TOKEN_EXPIRY as SignOptions["expiresIn"] }
  );

export const createHash = (token: string) =>
  crypto.createHash("sha256").update(token).digest("hex");

export const generateToken = () => {
  const unHashedToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = createHash(unHashedToken);
  const tokenExpiry = new Date(Date.now() + 30 * 60 * 1000);

  return { unHashedToken, hashedToken, tokenExpiry };
};
