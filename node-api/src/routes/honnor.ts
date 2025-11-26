import { Router } from "express";
import {
  getHonnors,
  getHonnorsAdminList,
  createHonnor,
  updateHonnor,
  deleteHonnor,
} from "../controllers/honnor";

const router = Router();

// 公共：启用的荣誉
router.get("/", getHonnors);

// 管理：分页 / 增 / 改 / 删
router.get("/admin", getHonnorsAdminList);
router.post("/admin", createHonnor);
router.put("/admin/:id", updateHonnor);
router.delete("/admin/:id", deleteHonnor);

export default router;