import { db, eq, problems } from "@repo/drizzle";
import {
  ApiResponse,
  asyncHandler,
  ApiError,
  logger,
  omitUndefined,
  UserRole,
} from "@repo/utils";
import {
  handleZodError,
  parseUuid,
  validateProblemData,
  validateUpdateProblemData,
} from "@repo/zod";
import { RequestHandler } from "express";
import { validateReferenceSolution } from "../utils/judge0";

export const createProblem: RequestHandler = asyncHandler(async (req, res) => {
  const { id: userId, role: userRole } = req.user;

  if (userRole !== UserRole.admin) {
    throw new ApiError(403, "You are not authorized to create a problem");
  }

  const {
    title,
    description,
    difficulty,
    tags,
    demo,
    examples,
    constraints,
    hints,
    editorial,
    codeSnippets,
    referenceSolutions,
    testcases,
  } = handleZodError(validateProblemData(req.body));

  const [existing] = await db
    .select()
    .from(problems)
    .where(eq(problems.title, title));

  if (existing) {
    throw new ApiError(409, "Problem already exists with the same title");
  }

  for (const { language, solution } of referenceSolutions) {
    await validateReferenceSolution(language, solution, testcases);
  }

  const [problem] = await db
    .insert(problems)
    .values({
      createdBy: userId,
      title,
      description,
      difficulty,
      tags,
      demo,
      editorial,
      examples,
      constraints,
      hints,
      codeSnippets,
      referenceSolutions,
      testcases,
    })
    .returning();

  logger.info(`Problem '${problem!.title}' created by user ${userId}`);

  res.status(201).json(
    new ApiResponse(201, "Problem created successfully", {
      id: problem!.id,
      title: problem!.title,
    })
  );
});

export const updateProblem: RequestHandler = asyncHandler(async (req, res) => {
  const userRole = req.user.role;

  if (userRole !== UserRole.admin) {
    throw new ApiError(403, "You are not authorized to update problems");
  }

  const { problemId } = req.params;
  parseUuid(problemId, "Problem");

  const payload = handleZodError(validateUpdateProblemData(req.body));

  const updatePayload = omitUndefined(payload);

  if (Object.keys(updatePayload).length === 0) {
    throw new ApiError(400, "At least one field is required to update");
  }

  if (updatePayload.referenceSolutions && updatePayload.testcases) {
    for (const { language, solution } of updatePayload.referenceSolutions) {
      await validateReferenceSolution(
        language,
        solution,
        updatePayload.testcases
      );
    }
  } else if (updatePayload.referenceSolutions || updatePayload.testcases) {
    // Reject if only one of them is provided
    throw new ApiError(
      400,
      "Both referenceSolutions and testcases must be provided together"
    );
  }

  const [updated] = await db
    .update(problems)
    .set({ ...updatePayload })
    .where(eq(problems.id, problemId!))
    .returning();

  logger.info(`Problem with ID ${problemId} updated successfully`);

  res.status(200).json({
    message: "Problem updated successfully",
    data: updated,
  });
});

export const deleteProblem: RequestHandler = asyncHandler(async (req, res) => {
  const { problemId } = req.params;
  if (!problemId) throw new ApiError(404, "ProblemId is required");

  parseUuid(problemId, "Problem");

  const [deletedProblem] = await db
    .delete(problems)
    .where(eq(problems.id, problemId))
    .returning();

  logger.info(
    `Problem '${deletedProblem!.title}' created by user ${req.user.id}`
  );

  res
    .status(200)
    .json(new ApiResponse(200, "Problem deleted successfully", deletedProblem));
});

export const getAllProblems: RequestHandler = asyncHandler(async (req, res) => {
  const allProblems = await db.select().from(problems);

  return res
    .status(200)
    .json(
      new ApiResponse(200, "All problems fetched successfully", allProblems)
    );
});

export const getProblemById: RequestHandler = asyncHandler(async (req, res) => {
  const { problemId } = req.params;
  if (!problemId) throw new ApiError(404, "ProblemId is required");

  parseUuid(problemId, "Problem");

  const [problem] = await db
    .select()
    .from(problems)
    .where(eq(problems.id, problemId));

  if (!problem) throw new ApiError(404, "Invalid problem id");
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        `Problem with ${problemId} fetched successfully`,
        problem
      )
    );
});
