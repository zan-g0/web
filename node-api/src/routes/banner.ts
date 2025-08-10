import { Router } from "express";
import { getBanners } from "../controllers/banner";
const router = Router();

router.get("/", getBanners);

export default router;
