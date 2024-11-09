import express from 'express';

import { MealPlans } from '../../db/mocks.js';
const router = express.Router();

const MAX_MEALS = 3;

// POST /mealplans
router.post('/', async (req, res) => {
    try {
        const user_id = Number(req.headers.user_id);
        const { week, meal } = req.body;

        // verify there is a requesting user (user_id)
        if (!user_id) {
            return res.status(403).json({ error: 'Forbidden user' });
        }

        const mealplan = MealPlans.find(user_id, week);
        if (mealplan) {
            if (mealplan.meals.length >= MAX_MEALS) {
                return res
                    .status(400)
                    .json({ message: 'Mealplan contains the maximum of 3 meals' });
            }
            const updatedMealPlan = MealPlans.add({ user_id, week, meal }, mealplan._id);
            return res.json(updatedMealPlan);
        }

        const addedMealplan = MealPlans.add({ user_id, week, meal });
        res.json(addedMealplan);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
});

// DELETE /mealplans/:id
router.delete('/:id', async (req, res) => {
    try {
        const user_id = Number(req.headers.user_id);
        const id = Number(req.params.id);

        // verify there is a requesting user (user_id)
        if (!user_id) {
            return res.status(403).json({ error: 'Forbidden user' });
        }

        const _id = MealPlans.delete(id);
        res.json({ _id, message: 'Delete success' });
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
});

export default router;
