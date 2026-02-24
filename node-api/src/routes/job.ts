import express from "express";
import { getJobPositions } from "../controllers/job";

const router = express.Router();

router.get("/", getJobPositions);

export default router;