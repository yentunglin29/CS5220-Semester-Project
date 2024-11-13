import express from 'express';

import { postMealplan, deleteMealplanById } from '../controllers/mealplan.js';
import { verifyUser } from '../middleware/authorization.js';

const router = express.Router();

const MAX_MEALS = 3;

router.use(verifyUser);

// POST /mealplans
router.post('/', postMealplan);

// DELETE /mealplans/:id
router.delete('/:id', deleteMealplanById);

export default router;
