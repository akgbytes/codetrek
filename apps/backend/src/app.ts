import express, { Express } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

export const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

import healthRoute from "./routes/health.route";

app.use("/api/v1/health", healthRoute);
