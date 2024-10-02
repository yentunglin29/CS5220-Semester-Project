import express from 'express';

import { Users, MealPlans } from '../../db/mocks.js';
const router = express.Router();

// POST /mealplans
router.post('/', async (req, res) => {
    try {
        const { user_id } = req.headers;  // User ID from the request header
        const { week, meal } = req.body;  // Meal and week from the request body

        if (!week || !meal || !meal.mealId || !meal.name || !meal.diets || !meal.image) {
            return res.status(422).json({ error: 'Week and complete meal data (mealId, name, diets, image) must be provided.' });
        }

        // Check if user exists
        const user = Users.find(parseInt(user_id));
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Find meal plan for the user and week
        let mealPlan = MealPlans.find(parseInt(user_id), week);

        if (mealPlan) {
            // Check if meal plan already has 3 meals
            if (mealPlan.meals.length >= 3) {
                return res.status(400).json({ error: 'Meal plan already contains 3 meals.' });
            }

            // Add the new meal to the existing meal plan
            mealPlan.meals.push(meal);
            return res.json(mealPlan);
        }

        // Create a new meal plan with the provided meal
        mealPlan = MealPlans.add({ user_id: parseInt(user_id), week, meal });
        res.status(201).json(mealPlan);

    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
});

// DELETE /mealplans/:id
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;        // Meal plan ID from the URL
        const { user_id } = req.headers;  // User ID from the request header

        // Find the meal plan by ID
        const mealPlan = MealPlans.mealplans.find(mealplan => mealplan._id === parseInt(id));
        if (!mealPlan) {
            return res.status(404).json({ error: 'Meal plan not found' });
        }

        // Check if the user_id in the meal plan matches the user_id in the header
        if (mealPlan.user_id !== parseInt(user_id)) {
            return res.status(403).json({ error: 'Forbidden: User ID mismatch.' });
        }

        // Delete the meal plan
        const deletedId = MealPlans.delete(parseInt(id));
        res.json({ message: 'Meal plan deleted', _id: deletedId });

    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
});

export default router;
