import { Router } from "express";
import {
  getprofileList,
  createprofile,
  updateprofile,
  deleteprofile,
} from "../../controllers/admin/profile";

const router = Router();

router.get("/", getprofileList);
router.post("/", createprofile);
router.put("/:id", updateprofile);
router.delete("/:id", deleteprofile);

export default router;