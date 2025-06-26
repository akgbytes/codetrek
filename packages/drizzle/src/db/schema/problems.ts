import { sql } from "drizzle-orm";
import {
  pgTable,
  text,
  boolean,
  uuid,
  pgEnum,
  json,
  PgTable,
  jsonb,
} from "drizzle-orm/pg-core";
import { users } from "./users";
import { timestamps } from "../helpers";
import { Difficulty } from "@repo/utils";

const difficultyEnum = pgEnum("difficulty", Difficulty);

export const problems = pgTable("problems", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").unique().notNull(),
  description: text("description").notNull(),
  difficulty: difficultyEnum().notNull(),
  tags: text("tags").array().notNull(),
  demo: boolean("demo").default(false),
  createdBy: uuid("created_by")
    .notNull()
    .references(() => users.id, {
      onDelete: "cascade",
    }),
  editorial: jsonb("editorial"),
  examples: jsonb("examples").notNull(),
  constraints: text("constraints").array().notNull(),
  hints: text("hints").array().notNull(),
  codeSnippets: jsonb("code_snippets").notNull(),
  referenceSolutions: jsonb("reference_solutions").notNull(),
  testcases: jsonb("testcases").notNull(),

  ...timestamps,
});
