import {
  pgTable,
  uuid,
  integer,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { users } from "./users";
import { contests } from "./contest";

export const contestants = pgTable(
  "contestants",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    contestId: uuid("contest_id")
      .notNull()
      .references(() => contests.id, { onDelete: "cascade" }),
    score: integer("score").default(0).notNull(),
    rank: integer("rank"),
    joinedAt: timestamp("joined_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    {
      uniqueUserContest: uniqueIndex("unique_user_contest").on(
        table.userId,
        table.contestId
      ),
    },
  ]
);
