import { Worker } from "bullmq";
import { connection } from "../configs/redis";
import { sendResetPasswordMail, sendVerificationMail } from "../utils/sendMail";
import { logger } from "@repo/utils";

const worker = new Worker(
  "email",
  async (job) => {
    const { type, fullname, email, token } = job.data;

    if (type === "verify") {
      await sendVerificationMail(fullname, email, token);
      logger.info("Verification email sent to", email);
    }

    if (type === "reset") {
      await sendResetPasswordMail(fullname, email, token);
      logger.info("Password reset email sent to", email);
    }
  },
  { connection }
);

logger.info("Email worker started and listening for jobs...");
