// drizzle/schema/playlist.ts
import {
  pgTable,
  uuid,
  text,
  boolean,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

import { timestamps } from "../helpers";
import { users } from "./users";

export const playlists = pgTable(
  "playlists",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    description: text("description"),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    visibilty: boolean("visibility").default(false),
    type: text("type").default("private"),
    ...timestamps,
  },
  (table) => [
    {
      userNameUnique: uniqueIndex("user_name_unique").on(
        table.userId,
        table.name
      ),
    },
  ]
);
