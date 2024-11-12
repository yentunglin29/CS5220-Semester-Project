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

// Post-save hook to log when a meal plan is created
MealPlanSchema.post('save', function (doc) {
    console.log(`Meal Plan for user ${doc.user_id} for week ${doc.week} has been created`);
});

// Post-delete hook to log when a meal plan is deleted
MealPlanSchema.post('deleteOne', { document: true, query: false }, function (doc) {
    console.log(`Meal Plan with ID ${doc._id} has been deleted`);
});

const MealPlan = mongoose.model('MealPlan', MealPlanSchema);

export default MealPlan;
