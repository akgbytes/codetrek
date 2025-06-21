import { pgTable, uuid, integer, boolean, text } from "drizzle-orm/pg-core";
import { submissions } from "./submissions";
import { timestamps } from "../helpers";
import { index } from "drizzle-orm/pg-core";

export const testCaseResults = pgTable(
  "test_case_results",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    submissionId: uuid("submission_id")
      .notNull()
      .references(() => submissions.id, { onDelete: "cascade" }),
    testCases: integer("test_case").notNull(),
    passed: boolean("passed").notNull(),
    stdout: text("stdout"),
    expected: text("expected").notNull(),
    stderr: text("stderr"),
    compileOutput: text("compile_output"),
    status: text("status").notNull(),
    memory: text("memory"),
    time: text("time"),
    ...timestamps,
  },
  (table) => ({
    submissionIdx: index("submission_idx").on(table.submissionId),
  })
);
