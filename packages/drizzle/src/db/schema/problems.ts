import { sql } from "drizzle-orm";
import {
  pgTable,
  integer,
  text,
  boolean,
  uuid,
  pgEnum,
  timestamp,
  json,
} from "drizzle-orm/pg-core";
import { users } from "./users";
import { timestamps } from "../helpers";

const difficultyEnum = pgEnum("difficulty", ["easy", "medium", "hard"]);

export const problems = pgTable("problems", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").unique().notNull(),
  description: text("description").notNull(),
  difficulty: difficultyEnum().notNull(),
  tags: text("tags").array().notNull().default([]),
  demo: boolean("demo").default(false),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  examples: json("examples").notNull(),
  constraints: text("constraints").notNull(),
  hints: text("hints"),
  editorial: text("editorial"),
  testcases: json("testcases").notNull(),
  codeSnippets: json("code_snippets").notNull(),
  referenceSolutions: json("reference_solutions").notNull(),

  ...timestamps,
});
