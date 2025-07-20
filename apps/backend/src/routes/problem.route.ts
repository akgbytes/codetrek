import { Router } from "express";
import {
  createProblem,
  deleteProblem,
  getAllProblems,
  getProblemById,
  updateProblem,
} from "../controllers/problem.controller";

const router: Router = Router();

router.get("/", getAllProblems);
router.get("/:problemId", getProblemById);
router.post("/create", createProblem);
router.patch("/update:problemId", updateProblem);
router.delete("/delete/:problemId", deleteProblem);

export default router;
