// routes/job.ts
import express from 'express';
import { getTalentConcept, getJobPositions, createJobPosition, updateJobPosition, deleteJobPosition } from '../controllers/job';

const router = express.Router();

router.get('/talent-concept', getTalentConcept);
router.get('/positions', getJobPositions);

// Job position CRUD operations
router.post('/positions', createJobPosition);
router.put('/positions/:id', updateJobPosition);
router.delete('/positions/:id', deleteJobPosition);

export default router;