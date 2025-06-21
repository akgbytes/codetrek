import { pgTable, uuid, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { timestamps } from "../helpers";
import { playlists } from "./playlist";
import { problems } from "./problems";

export const problemInPlaylists = pgTable(
  "problem_in_playlists",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    playListId: uuid("playlist_id")
      .notNull()
      .references(() => playlists.id, { onDelete: "cascade" }),
    problemId: uuid("problem_id")
      .notNull()
      .references(() => problems.id, { onDelete: "cascade" }),
    ...timestamps,
  },
  (table) => [
    {
      uniquePlaylistProblem: uniqueIndex("unique_playlist_problem").on(
        table.playListId,
        table.problemId
      ),
    },
  ]
);
