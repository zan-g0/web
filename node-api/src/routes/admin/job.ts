import express from "express";
import { 
  getJobPositions,
  createJobPosition,
  updateJobPosition,
  deleteJobPosition,
  updateDisplayOrder 
} from "../../controllers/admin/job";

const router = express.Router();

// 确保路由路径正确
router.get("/", getJobPositions);
router.post("/", createJobPosition);
router.put("/:id", updateJobPosition);
router.delete("/:id", deleteJobPosition);
router.post("/display-order", updateDisplayOrder);

export default router;