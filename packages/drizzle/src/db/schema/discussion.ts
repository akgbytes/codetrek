import { pgTable, uuid, text, integer, uniqueIndex } from "drizzle-orm/pg-core";
import { users } from "./users";
import { timestamps } from "../helpers";

export const discussions = pgTable(
  "discussions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    description: text("description").notNull(),
    tags: text("tags").array().notNull().default([]),
    commentsCount: integer("comments_count").default(0).notNull(),
    upvotes: integer("upvotes").default(0),
    views: integer("views").default(0),
    ...timestamps,
  },
  (table) => [
    {
      userTitleUnique: uniqueIndex("user_title_unique").on(
        table.userId,
        table.title
      ),
    },
  ]
);
