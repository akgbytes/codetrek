import { Difficulty } from "@repo/utils";
import { z } from "zod";
import { jsonSchema } from "./jsonSchema";

export const testcaseSchema = z.array(
  z.object({
    input: z.string(),
    output: z.string(),
  })
);

export const problemSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, { message: "Problem title must not be empty" })
    .max(25, "Problem title must not exceed more than 50 characters"),

  description: z
    .string()
    .trim()
    .min(1, { message: "Problem description is required" })
    .max(100, {
      message: "Problem description must not exceed more than 100 characters",
    }),

  difficulty: z.nativeEnum(Difficulty, {
    message: "Difficulty must be either EASY, MEDIUM or HARD",
  }),

  demo: z.boolean().default(false),

  tags: z
    .array(z.string())
    .nonempty({ message: "At least one tag is required" }),

  examples: z.array(
    z.object({
      input: z.string(),
      output: z.string(),
      explanation: z.string().optional(),
    })
  ),

  constraints: z.array(z.string()),
  hints: z.array(z.string()),

  editorial: jsonSchema,

  testcases: testcaseSchema.nonempty({
    message: "At least one test case is required",
  }),

  codeSnippets: z.array(
    z.object({
      language: z.string(),
      snippet: z.string(),
    })
  ),

  referenceSolutions: z.array(
    z.object({
      language: z.string(),
      solution: z.string(),
    })
  ),
});

export type Problem = z.infer<typeof problemSchema>;

export const validateProblemData = (data: Problem) =>
  problemSchema.safeParse(data);
