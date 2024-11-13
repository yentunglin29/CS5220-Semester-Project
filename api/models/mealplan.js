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

// Pre-save hook to hash the password before saving
UserSchema.pre('save', async function (next) {
    await hashUserPassword(this);
    next();
});

const MealPlan = mongoose.model('MealPlan', MealPlanSchema);

export default MealPlan;
