import { User } from "@repo/drizzle";

export type decodedUser = Pick<User, "id" | "email" | "role">;

declare global {
  namespace Express {
    interface Request {
      user: decodedUser;
    }
  }
}
