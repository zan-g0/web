// routes/job.ts
import express from 'express';
import { getJobPositions, createJobPosition, updateJobPosition, deleteJobPosition } from '../controllers/job';

const router = express.Router();

router.get('/positions', getJobPositions);
router.post('/positions', createJobPosition);
router.put('/positions/:id', updateJobPosition);
router.delete('/positions/:id', deleteJobPosition);

export default router;