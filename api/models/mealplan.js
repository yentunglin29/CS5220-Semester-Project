import mongoose from 'mongoose';

const MealPlanSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    week: { type: Number, required: true },
    meals: [
        {
            mealId: { type: Number, required: true },
            name: { type: String, required: true },
            diets: { type: [String], required: true },
            image: { type: String, required: true }
        }
    ]
});

// Pre-save hook to ensure no more than 3 meals in a meal plan
MealPlanSchema.pre('save', function (next) {
    if (this.meals.length > 3) {
        const error = new Error('Meal plans cannot contain more than 3 meals.');
        return next(error);
    }
    next();
});

const MealPlan = mongoose.model('MealPlan', MealPlanSchema);

export default MealPlan;
