import { Router } from "express";
import { getHonor } from "../controllers/honor";

const router = Router();
router.get("/", getHonor);
export default router;