import mongoose from 'mongoose';
import MealPlan from '../models/mealplan.js';

const postMealplan = async (req, res) => {
    try {
        const { user_id } = req.verified;
        const { week, meal } = req.body;

        let mealplan = await MealPlan.findOne({ user_id, week });
        if (mealplan) {
            if (mealplan.meals.length >= 3) {
                return res.status(400).json({ message: 'Meal plan contains the maximum of 3 meals' });
            }
            mealplan.meals.push(meal);
            await mealplan.save();
            return res.json(mealplan);
        }

        const newMealPlan = await MealPlan.create({ user_id, week, meals: [meal] });
        res.json(newMealPlan);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteMealplanById = async (req, res) => {
    try {
        const { user_id } = req.verified; // Extract user_id from the verified token
        const mealPlanId = req.params.id;
        const { meal_id } = req.body; // Extract meal_id from the request body

        console.log('Request Body:', req.body);
        console.log('Extracted meal_id:', meal_id);

        if (!user_id) {
            return res.status(403).json({ error: 'Forbidden user' });
        }

        if (!meal_id) {
            return res.status(400).json({ error: 'Meal ID is required' });
        }

        // Convert the meal_id to ObjectId
        let mealObjectId;
        try {
            mealObjectId = new mongoose.Types.ObjectId(meal_id);
        } catch (err) {
            return res.status(400).json({ error: 'Invalid Meal ID format' });
        }

        // Find the meal plan by its ID and ensure it belongs to the authenticated user
        const mealplan = await MealPlan.findOne({ _id: mealPlanId, user_id });

        if (!mealplan) {
            return res.status(404).json({ error: 'Meal plan not found' });
        }

        console.log('Existing meals before deletion:', mealplan.meals);

        // Filter out the meal with the specified mealObjectId
        const updatedMeals = mealplan.meals.filter(meal => !meal._id.equals(mealObjectId));

        if (updatedMeals.length === mealplan.meals.length) {
            console.log(`Meal ID not found: ${meal_id}`);
            return res.status(404).json({ error: 'Meal not found in meal plan' });
        }

        // Update the meals array and save the meal plan
        mealplan.meals = updatedMeals;

        // If no meals are left, delete the entire meal plan
        if (updatedMeals.length === 0) {
            await MealPlan.deleteOne({ _id: mealPlanId });
            return res.json({ message: 'Meal plan deleted successfully' });
        }

        await mealplan.save();
        return res.json({ message: 'Meal removed from meal plan', mealplan });

    } catch (error) {
        console.error('Error deleting meal:', error);
        return res.status(500).json({ error: error.message });
    }
};

export { postMealplan, deleteMealplanById };
