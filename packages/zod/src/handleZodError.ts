import { SafeParseReturnType } from "zod";
import { CustomError } from "@repo/utils";

export const handleZodError = <T>(
  result: SafeParseReturnType<unknown, T>
): T => {
  if (result.success) return result.data;

  const issue = result.error?.issues[0];
  const path = issue?.path.join(".");
  const isMissing =
    issue?.code === "invalid_type" && issue.received === "undefined";

  throw new CustomError(
    isMissing ? 400 : 422,
    isMissing
      ? path
        ? `Missing '${path}' field`
        : "Missing required fields"
      : issue!.message
  );
};
