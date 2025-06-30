import { capitalize } from "../strings";
import { sendMail } from "./mailService";
import {
  emailVerificationMailContent,
  resetPasswordMailContent,
} from "./mailGenerator";
import { env } from "@repo/zod";

export const sendVerificationMail = async (
  fullName: string,
  email: string,
  token: string
) => {
  const link = `${env.CLIENT_URL}/verify-email/${token}`;
  const name = capitalize(fullName);
  await sendMail(
    email,
    "Verify Your Email",
    emailVerificationMailContent(name, link)
  );
};

export const sendResetPasswordMail = async (
  fullName: string,
  email: string,
  token: string
) => {
  const link = `${env.CLIENT_URL}/reset-password/${token}`;
  const name = capitalize(fullName);
  await sendMail(
    email,
    "Reset Your Password",
    resetPasswordMailContent(name, link)
  );
};
