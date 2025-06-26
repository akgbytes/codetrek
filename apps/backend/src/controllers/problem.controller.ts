import { db, eq, problems } from "@repo/drizzle";
import {
  ApiResponse,
  asyncHandler,
  CustomError,
  logger,
  UserRole,
} from "@repo/utils";
import { handleZodError, validateProblemData } from "@repo/zod";
import { RequestHandler } from "express";
import { validateReferenceSolution } from "../utils/judge0";

export const createProblem: RequestHandler = asyncHandler(async (req, res) => {
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

  const { id: userId, role: userRole } = req.user;

  if (userRole !== UserRole.admin) {
    throw new CustomError(403, "You are not authorized to create a problem");
  }

  const [existing] = await db
    .select()
    .from(problems)
    .where(eq(problems.title, title));

  if (existing) {
    throw new CustomError(409, "Problem already exists with the same title");
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
