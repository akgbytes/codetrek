import { capitalize } from "../strings";
import { sendMail } from "./mailService";
import {
  emailVerificationMailContent,
  resetPasswordMailContent,
} from "./mailGenerator";
import { env } from "@repo/zod";

export const sendVerificationMail = async (
  fullname: string,
  email: string,
  token: string
) => {
  const link = `${env.CLIENT_URL}/verify-email/${token}`;
  const name = capitalize(fullname);
  await sendMail(
    email,
    "Verify Your Email",
    emailVerificationMailContent(name, link)
  );
};

export const sendResetPasswordMail = async (
  fullname: string,
  email: string,
  token: string
) => {
  const link = `${env.CLIENT_URL}/reset-password/${token}`;
  const name = capitalize(fullname);
  await sendMail(
    email,
    "Reset Your Password",
    resetPasswordMailContent(name, link)
  );
};
