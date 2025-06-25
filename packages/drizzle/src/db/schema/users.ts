import {
  pgTable,
  integer,
  text,
  boolean,
  uuid,
  pgEnum,
  timestamp,
} from "drizzle-orm/pg-core";
import { timestamps } from "../helpers";
import { InferSelectModel } from "drizzle-orm";

export const roleEnum = pgEnum("role", ["USER", "ADMIN"]);
export const providerEnum = pgEnum("provider", ["LOCAL", "GOOGLE", "GITHUB"]);

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  username: text("username").unique().notNull(),
  fullname: text("fullname").notNull(),
  email: text("email").unique().notNull(),
  isVerified: boolean("is_verified").default(false),
  avatar: text("avatar").default(
    "https://res.cloudinary.com/dmnh10etf/image/upload/v1750270944/default_epnleu.png"
  ),
  role: roleEnum("role").default("USER"),
  password: text("password"),
  provider: providerEnum("provider").default("LOCAL"),

  dailyProblemStreak: integer("daily_problem_streak").default(0),
  isStreakMaintained: boolean("is_streak_maintained").default(false),
  lastSubmissionDate: timestamp("last_submission_date"),

  forgotPasswordToken: text("forgot_password_token"),
  forgotPasswordExpiry: timestamp("forgot_password_expiry"),
  emailVerificationToken: text("email_verification_token"),
  emailVerificationExpiry: text("email_verification_expiry"),

  refreshToken: text("refresh_token"),
  ...timestamps,
});

export type User = InferSelectModel<typeof users>;
