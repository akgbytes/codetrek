import { pgTable, uuid, text, integer, timestamp } from "drizzle-orm/pg-core";
import { discussions } from "./discussion";
import { users } from "./users";
import { timestamps } from "../helpers";

export const comments = pgTable("comments", {
  id: uuid("id").defaultRandom().primaryKey(),
  discussionId: uuid("discuss_id")
    .notNull()
    .references(() => discussions.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  comment: text("comment").notNull(),
  upvote: integer("upvote").default(0),
  ...timestamps,
});
