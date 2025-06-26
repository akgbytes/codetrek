import { CustomError } from "@repo/utils";
import { env } from "@repo/zod";
import axios from "axios";

type Submission = {
  language_id: number;
  source_code: string;
  stdin: string;
  expected_output: string;
};

type Token = {
  token: string;
};

type SubmissionResult = {
  compile_output: string | null;
  memory: number;
  message: string | null;
  status: {
    description: string;
    id: number;
  };
  stderr: string | null;
  stdout: string;
  time: string;
  token: string;
};

const LANGUAGE_MAP: Record<string, number> = {
  "C++": 54,
  PYTHON: 71,
  JAVASCRIPT: 63,
  JAVA: 62,
};

const LANGUAGE_ID_MAP = Object.fromEntries(
  Object.entries(LANGUAGE_MAP).map(([language, id]) => [id, language])
);

export const getLanguageId = (language: string) => {
  const normalized = language.toUpperCase();
  const id = LANGUAGE_MAP[normalized];
  if (!id)
    throw new CustomError(400, `Language "${language}" is not supported.`);

  return id;
};

export const getLanguageName = (id: string) => {
  const name = LANGUAGE_ID_MAP[id];
  if (!name) throw new CustomError(400, `Language ID ${id} is not supported.`);

  return name;
};

const judge0Headers = {
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
      { headers: judge0Headers }
    );
    return data;
  } catch (error: any) {
    const message = error.message || "Unknown error";
    throw new CustomError(500, `Failed to create submission batch: ${message}`);
  }
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

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
          headers: judge0Headers,
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
