import { Difficulty, ProblemType } from "@repo/utils";
import { z } from "zod";
import { jsonSchema } from "./json";

export const testcaseSchema = z.array(
  z.object({
    input: z.string().nonempty({ message: "Test case input is required" }),
    output: z.string().nonempty({ message: "Test case output is required" }),
  })
);

export const problemSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, { message: "Problem title must not be empty" })
    .max(50, "Problem title must not exceed 50 characters"),

  description: z
    .string()
    .trim()
    .min(1, { message: "Problem description must not be empty" })
    .max(100, {
      message: "Problem description must not exceed 100 characters",
    }),

  difficulty: z.nativeEnum(Difficulty, {
    message: "Difficulty must be either EASY, MEDIUM or HARD",
  }),

  type: z.nativeEnum(ProblemType, {
    message: "Types must be either FREE, PREMIUM or DEMO",
  }),

  tags: z
    .array(z.string().trim().min(1, "Tag must not be empty"))
    .nonempty({ message: "At least one tag is required" }),

  examples: z
    .array(
      z.object({
        input: z.string({ message: "Example input is required" }),
        output: z.string({ message: "Example output is required" }),
        explanation: z.string().optional(),
      })
    )
    .nonempty({ message: "At least one example is required" }),

  constraints: z
    .array(z.string({ message: "Constraint must be a string" }))
    .nonempty({ message: "At least one constraint is required" }),

  hints: z
    .array(z.string({ message: "Hint must be a string" }))
    .nonempty({ message: "At least one hint is required" }),

  editorial: jsonSchema.optional(),

  testcases: testcaseSchema.nonempty({
    message: "At least one test case is required",
  }),

  codeSnippets: z
    .array(
      z.object({
        language: z.string({ message: "Snippet language is required" }),
        snippet: z.string({ message: "Snippet code is required" }),
      })
    )
    .nonempty({ message: "At least one code snippet is required" }),

  referenceSolutions: z
    .array(
      z.object({
        language: z.string({
          message: "Reference solution language is required",
        }),
        solution: z.string({ message: "Reference solution code is required" }),
      })
    )
    .nonempty({ message: "At least one reference solution is required" }),
});

export const updateProblemSchema = problemSchema.partial();

export type Problem = z.infer<typeof problemSchema>;

export const validateProblemData = (data: unknown) =>
  problemSchema.safeParse(data);

export const validateUpdateProblemData = (data: unknown) =>
  updateProblemSchema.safeParse(data);
