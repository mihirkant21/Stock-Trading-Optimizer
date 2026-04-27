import express from 'express';
import { calculateOptimalStrategy, saveScenario, getScenarios } from '../controllers/optimizerController.js';

const router = express.Router();

router.post('/calculate', calculateOptimalStrategy);
router.post('/save', saveScenario);
router.get('/scenarios', getScenarios);

export default router;
