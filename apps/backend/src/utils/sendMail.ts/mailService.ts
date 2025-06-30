import { resend } from "./resendClient";
import { mailGenerator } from "./mailGenerator";
import { env } from "@repo/zod";
import { CustomError } from "@repo/utils";
import Mailgen from "mailgen";

export const sendMail = async (
  to: string,
  subject: string,
  content: Mailgen.Content
) => {
  const html = mailGenerator.generate(content);
  const text = mailGenerator.generatePlaintext(content);

  try {
    await resend.emails.send({
      from: env.RESEND_SENDERMAIL,
      to,
      subject,
      html,
      text,
    });
  } catch (error) {
    throw new CustomError(500, `Failed to send "${subject}" email.`);
  }
};
