import { Router } from "express";
import { getCulture } from "../controllers/culture";

const router = Router();
router.get("/", getCulture);
export default router;