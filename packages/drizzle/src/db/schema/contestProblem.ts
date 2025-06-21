import { pgTable, uuid, integer, uniqueIndex } from "drizzle-orm/pg-core";

export const contestProblems = pgTable(
  "contest_problems",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    contestId: uuid("contest_id").notNull(),
    problemId: uuid("problem_id").notNull(),
    points: integer("points").default(100).notNull(),
    order: integer("order").default(0).notNull(),
  },
  (table) => [
    {
      uniqueContestProblem: uniqueIndex("unique_contest_problem").on(
        table.contestId,
        table.problemId
      ),
    },
  ]
);
