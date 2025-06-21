import { pgTable, uuid, text, json } from "drizzle-orm/pg-core";
import { users } from "./users";
import { problems } from "./problems";
import { timestamps } from "../helpers";

export const submissions = pgTable("submissions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  problemId: uuid("problem_id")
    .notNull()
    .references(() => problems.id, { onDelete: "cascade" }),
  sourceCode: json("source_code").notNull(),
  language: text("language").notNull(),
  stdin: text("stdin"),
  stdout: text("stdout"),
  stderr: text("stderr"),
  compileOutput: text("compile_output"),
  status: text("status").notNull(), // Accepted , Wrong, Runtime Error, Time Limit Exceeded
  memory: text("memory"),
  time: text("time"),
  ...timestamps,
});
