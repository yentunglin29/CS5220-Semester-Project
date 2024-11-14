import express from 'express';

import { verifyUser } from '../middleware/authorization.js';

import { getMealPlanByMealId } from '../controllers/meal.js';

const router = express.Router();

router.use(verifyUser);

// GET /meals/search
router.get('/search', getMealPlanByMealId);

export default router;
