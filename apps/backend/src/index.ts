import { connectDrizzle } from "@repo/drizzle";
import { app } from "./app";
import { env } from "@repo/zod";
import { logger } from "@repo/utils";

connectDrizzle();

const PORT = env.PORT;

app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});
