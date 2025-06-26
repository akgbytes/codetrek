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

  if (userRole?.toUpperCase() !== UserRole.admin) {
    logger.error("Unauthorized Request: User not authenticated");
    throw new CustomError(403, "You are not allowed to create a problem");
  }

  const [existing] = await db
    .select()
    .from(problems)
    .where(eq(problems.title, title));

  if (existing) {
    throw new CustomError(409, "Problem already exists with same title");
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

  logger.info(
    `Problem with title '${problem?.title}' created successfully by ${userId}`
  );

  res
    .status(201)
    .json(new ApiResponse(201, "Problem created successfully", problem));
});
