import express, { Express } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

export const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

import healthRoute from "./routes/health.route";
import problemRoutes from "./routes/problem.route";
import { errorHandler } from "./middlewares/error.middleware";
import authRoutes from "./routes/auth.route";

app.use("/api/v1/health", healthRoute);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/problems", problemRoutes);
app.use(errorHandler);
