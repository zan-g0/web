import { Router } from "express";
import { getCompanyProfile } from "../controllers/companyProfile";

const router = Router();
router.get("/", getCompanyProfile);
export default router;