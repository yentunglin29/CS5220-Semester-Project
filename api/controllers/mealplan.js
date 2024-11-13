import MealPlan from '../models/mealplan.js';

const postMealplan = async (req, res) => {
    try {
        const { user_id } = req.verified;
        const { week, meal } = req.body;

        const mealplan = MealPlan.find(user_id, week);
        if (mealplan) {
            if (mealplan.meals.length >= MAX_MEALS) {
                return res
                    .status(400)
                    .json({ message: 'Mealplan contains the maximum of 3 meals' });
            }
            const updatedMealPlan = MealPlan.add({ user_id, week, meal }, mealplan._id);
            return res.json(updatedMealPlan);
        }

        const addedMealplan = MealPlan.add({ user_id, week, meal });
        res.json(addedMealplan);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};

const deleteMealplanById = async (req, res) => {
    try {
        const { user_id } = req.verified;
        const id = Number(req.params.id);

        // verify there is a requesting user (user_id)
        if (!user_id) {
            return res.status(403).json({ error: 'Forbidden user' });
        }

        const _id = MealPlan.delete(id);
        res.json({ _id, message: 'Delete success' });
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};

export { postMealplan, deleteMealplanById };