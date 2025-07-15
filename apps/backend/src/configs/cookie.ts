import { env } from "@repo/zod";
import ms, { StringValue } from "ms";

export function generateCookieOptions() {
  const expiry = env.REFRESH_TOKEN_EXPIRY;
  return {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "strict" as const,
    maxAge: ms(expiry as StringValue),
  };
}
