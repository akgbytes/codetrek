export type Submission = {
  language_id: number;
  source_code: string;
  stdin: string;
  expected_output: string;
};

export type Token = {
  token: string;
};

export type SubmissionResult = {
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
