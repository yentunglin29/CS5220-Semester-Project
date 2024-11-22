import express from 'express';

import { postMealplan, deleteMealplanById } from '../controllers/mealplan.js';
import { verifyUser } from '../middleware/authorization.js';

const router = express.Router();

router.use(verifyUser);

// POST /mealplans
router.post('/', verifyUser, postMealplan);

// DELETE /mealplans/:id
router.delete('/:id', verifyUser, deleteMealplanById);

export default router;
