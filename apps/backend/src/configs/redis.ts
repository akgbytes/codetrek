import { env } from "@repo/zod";
import IORedis from "ioredis";

export const connection = new IORedis({
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
});

/*
{
  attempts: 3,
  backoff: {
    type: "exponential",
    delay: 2000, // 2 seconds
  },
}
*/
