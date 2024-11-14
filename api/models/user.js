import mongoose from 'mongoose';
import { hashUserPassword } from '../utils/auth.js';

const UserSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true
        },
        password: {
            type: String,
            required: true
        },
        preferences: {
            type: [String],
            required: true,
            default: []
        }
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// virtual to populate the associated mealplans for the user
UserSchema.virtual('mealplans', {
    ref: 'MealPlan',
    localField: '_id',
    foreignField: 'user_id'
});

// Pre-save hook to hash the password before saving
UserSchema.pre('save', async function (next) {
    await hashUserPassword(this);
    next();
});

const User = mongoose.model('User', UserSchema);

export default User;
