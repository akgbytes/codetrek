import { CustomError } from "@repo/utils";
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
      throw new CustomError(
        400,
        `Submission ${idx + 1} failed, status ${result.status.description}: ${result.stderr}`
      );
    }
  });
};
