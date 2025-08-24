// routes/job.ts
import express from 'express';
import { getTalentConcept, getJobPositions } from '../controllers/job';

const router = express.Router();

router.get('/talent-concept', getTalentConcept);
router.get('/positions', getJobPositions);

export default router;