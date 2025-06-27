import { Router } from "express";
import { createProblem } from "../controllers/problem.controller";

const router: Router = Router();

router.post("/create", createProblem);

export default router;
