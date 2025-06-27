import { z } from "zod";
import { handleZodError } from "./handleZodError";

export const parseUuid = (id: unknown, name: string) => {
  const uuidSchema = z.string().uuid({ message: `Invalid ${name} ID` });
  handleZodError(uuidSchema.safeParse(id));
};
