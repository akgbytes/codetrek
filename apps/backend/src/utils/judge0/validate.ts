import { ApiError } from "@repo/utils";
import { createSubmissionBatch, pollSubmissionBatchResult } from "./api";
import { getLanguageId } from "./utils";

export const validateReferenceSolution = async (
  language: string,
  solution: string,
  testcases: { input: string; output: string }[]
): Promise<void> => {
  const languageId = getLanguageId(language);

  const submissions = testcases.map(({ input, output }) => ({
    language_id: languageId,
    source_code: solution,
    stdin: input,
    expected_output: output,
  }));

  const tokens = await createSubmissionBatch(submissions);
  const results = await pollSubmissionBatchResult(tokens);

  results.forEach((result, idx) => {
    if (result.status.id !== 3) {
      const errorMessage =
        result.stderr || result.compile_output || "No error output";
      throw new ApiError(
        400,
        `Submission ${idx + 1} failed: ${result.status.description} — ${errorMessage}`
      );
    }
  });
};
