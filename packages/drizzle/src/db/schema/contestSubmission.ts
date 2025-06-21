import {
  pgTable,
  uuid,
  integer,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const contestSubmissions = pgTable(
  "contest_submissions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    contestId: uuid("contest_id").notNull(),
    userId: uuid("user_id").notNull(),
    problemId: uuid("problem_id").notNull(),
    submissionId: uuid("submission_id").notNull(),
    score: integer("score"),
    timeTaken: integer("time_taken"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    {
      uniqueSubmission: uniqueIndex("unique_submission").on(table.submissionId),
      uniqueUserContestProblem: uniqueIndex("unique_user_contest_problem").on(
        table.userId,
        table.contestId,
        table.problemId
      ),
    },
  ]
);
