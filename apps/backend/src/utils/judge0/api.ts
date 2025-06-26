import { env } from "@repo/zod";
import { Submission, SubmissionResult, Token } from "./types";
import axios from "axios";
import { CustomError } from "@repo/utils";
import { sleep } from "./utils";

const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${env.JUDGE0_API_KEY}`,
};

export const createSubmissionBatch = async (
  submissions: Submission[]
): Promise<Token[]> => {
  try {
    const { data } = await axios.post<Token[]>(
      `${env.JUDGE0_API_URL}/submissions/batch`,
      { submissions },
      { headers }
    );
    return data;
  } catch (error: any) {
    const message = error.message || "Unknown error";
    throw new CustomError(500, `Failed to create submission batch: ${message}`);
  }
};

export const pollSubmissionBatchResult = async (
  tokens: Token[]
): Promise<SubmissionResult[]> => {
  const interval = 1000; // polling interval in ms
  const timeout = 10000; // max time to wait in ms
  const startTime = Date.now();
  try {
    while (true) {
      const { data } = await axios.get<{ submissions: SubmissionResult[] }>(
        `${env.JUDGE0_API_URL}/submissions/batch`,
        {
          params: {
            tokens: tokens.map((t) => t.token).join(","),
            base64_encoded: false,
          },
          headers,
        }
      );

      const results = data.submissions;
      const isAllDone = results.every((result) => result.status.id >= 3);
      if (isAllDone) return results;

      if (Date.now() - startTime > timeout) {
        throw new CustomError(
          408,
          "Polling timeout, submissions took too long"
        );
      }

      await sleep(interval);
    }
  } catch (error: any) {
    const message = error.message || "Unknown error";
    throw new CustomError(
      500,
      `Error while polling submissions result: ${message}`
    );
  }
};
