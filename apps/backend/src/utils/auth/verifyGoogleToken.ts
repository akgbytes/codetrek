import { ApiError } from "@repo/utils";
import { env } from "@repo/zod";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(env.GOOGLE_CLIENT_ID);

export const verifyGoogleToken = async (token: string) => {
  if (!token) {
    throw new ApiError(400, "Google credentials token is required");
  }

  let payload;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: env.GOOGLE_CLIENT_ID,
    });

    payload = ticket.getPayload();
  } catch (error) {
    throw new ApiError(401, "Invalid Google credentials token");
  }

  if (!payload) {
    throw new ApiError(
      401,
      "Google token verification failed. No payload received."
    );
  }

  return payload;
};
