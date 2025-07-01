import { Queue } from "bullmq";
import { connection } from "../configs/redis";

export const emailQueue = new Queue("email", { connection });
