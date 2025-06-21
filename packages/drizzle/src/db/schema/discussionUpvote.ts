import { pgTable, uuid, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { users } from "./users";
import { discussions } from "./discussion";
import { timestamps } from "../helpers";

export const discussionUpvotes = pgTable(
  "discussion_upvotes",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    discussionId: uuid("discussion_id")
      .notNull()
      .references(() => discussions.id, { onDelete: "cascade" }),
    ...timestamps,
  },
  (table) => [
    {
      uniqueUserDiscussion: uniqueIndex("unique_user_discussion").on(
        table.userId,
        table.discussionId
      ),
    },
  ]
);
