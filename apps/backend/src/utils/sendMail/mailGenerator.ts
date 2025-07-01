import Mailgen from "mailgen";
import { env } from "@repo/zod";

export const mailGenerator = new Mailgen({
  theme: "default",
  product: {
    name: "Codetrek",
    link: env.CLIENT_URL,
  },
});

export const emailVerificationMailContent = (
  fullName: string,
  link: string
) => ({
  body: {
    name: fullName,
    intro: "Welcome to Codetrek! We're excited to have you on board.",
    action: {
      instructions:
        "To complete your registration, please verify your email by clicking below:",
      button: {
        color: "#22BC66",
        text: "Verify Email",
        link,
      },
    },
    outro: "If you have any questions, just reply to this email.",
    signature: false,
  },
});

export const resetPasswordMailContent = (fullName: string, link: string) => ({
  body: {
    name: fullName,
    intro: "You requested to reset your password.",
    action: {
      instructions: "Click the button below to reset your password:",
      button: {
        color: "#FF613C",
        text: "Reset Password",
        link,
      },
    },
    outro: "If you didn’t request this, please ignore this email.",
    signature: false,
  },
});
