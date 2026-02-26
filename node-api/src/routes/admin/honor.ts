import { Router } from "express";
import {
  getHonor,
  createHonor,
  updateHonor,
  deleteHonor,
} from "../../controllers/admin/honor";

const router = Router();

// 管理：分页 / 增 / 改 / 删
router.get("/", getHonor);
router.post("/", createHonor);
router.put("/:id", updateHonor);
router.delete("/:id", deleteHonor);
export default router;