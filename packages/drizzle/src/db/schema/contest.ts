import {
  pgTable,
  uuid,
  text,
  timestamp,
  uniqueIndex,
  pgEnum,
} from "drizzle-orm/pg-core";
import { timestamps } from "../helpers";

export const contestStatusEnum = pgEnum("contest_status", [
  "UPCOMING",
  "ONGOING",
  "FINISHED",
]);

export const contests = pgTable(
  "contests",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    title: text("title").notNull(),
    description: text("description"),
    startTime: timestamp("start_time", { withTimezone: true }).notNull(),
    endTime: timestamp("end_time", { withTimezone: true }).notNull(),
    status: contestStatusEnum("status").default("UPCOMING").notNull(),
    ...timestamps,
  },
  (table) => [
    {
      uniqueTitle: uniqueIndex("unique_contest_title").on(table.title),
    },
  ]
);
