import { pgTable, uuid, uniqueIndex } from "drizzle-orm/pg-core";
import { users } from "./users";
import { comments } from "./comment";
import { timestamps } from "../helpers";

export const commentUpvotes = pgTable(
  "comment_upvotes",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    commentId: uuid("comment_id")
      .notNull()
      .references(() => comments.id, { onDelete: "cascade" }),

    ...timestamps,
  },
  (table) => [
    {
      uniqueUserComment: uniqueIndex("unique_user_comment").on(
        table.userId,
        table.commentId
      ),
    },
  ]
);
