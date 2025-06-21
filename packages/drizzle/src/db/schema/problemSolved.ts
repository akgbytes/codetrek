// drizzle/schema/problemSolved.ts
import { pgTable, uuid, uniqueIndex } from "drizzle-orm/pg-core";
import { users } from "./users";
import { problems } from "./problems";
import { timestamps } from "../helpers";

export const problemsSolved = pgTable(
  "problems_solved",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    problemId: uuid("problem_id")
      .notNull()
      .references(() => problems.id, { onDelete: "cascade" }),

    ...timestamps,
  },
  (table) => [
    {
      uniqueUserProblem: uniqueIndex("unique_user_problem").on(
        table.userId,
        table.problemId
      ),
    },
  ]
);
