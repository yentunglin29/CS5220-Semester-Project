import 'dotenv/config';
import mongoose from 'mongoose';

import User from './api/models/user.js';
import MealPlan from './api/models/mealplan.js';

const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_ADDRESS = process.env.DB_ADDRESS;
const DB_NAME = process.env.DB_NAME;

const connect = async () => {
    try {
        const MONGO_URI = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_ADDRESS}/?retryWrites=true&w=majority&appName=Cluster0`;
        await mongoose.connect(MONGO_URI, { dbName: DB_NAME });
        console.log('Connected to Mongo');
    } catch (error) {
        console.error(`Error connecting to Mongo: ${error.message}`);
    }
};

// MOCK DATA
const mealplanData = [
    {
        week: 1,
        meals: [
            {
                mealId: 1591791,
                name: 'Keto Snickerdoodle Coffee',
                diets: ['gluten free', 'lacto ovo vegetarian', 'primal', 'ketogenic'],
                image: 'https://img.spoonacular.com/recipes/1591791-312x231.jpg'
            },
            {
                mealId: 1652621,
                name: 'Keto Pancakes',
                diets: ['gluten free', 'dairy free', 'lacto ovo vegetarian', 'ketogenic'],
                image: 'https://img.spoonacular.com/recipes/1652621-312x231.jpg'
            }
        ]
    }
];

const userData = {
    username: 'prof_auman',
    password: 'future_hashed_password',
    preferences: ['ketogenic']
};

const execScript = async () => {
    try {
        await connect();

        // clean both collections to ensure fresh data insert
        await User.deleteMany({});
        await MealPlan.deleteMany({});

        // add mock user data into MongoDB
        const user = await User.create(userData);

        // add mock mealplan data into MongoDB and associate the user to mealplan
        for (const mealplan of mealplanData) {
            mealplan.user_id = user._id;
            await MealPlan.create(mealplan);
        }

        // query the user by _id without password and populate their mealplans
        const userWithMealplans = await User.findById(user._id)
            .select('-password') // exclude password field
            .populate('mealplans'); // populate the mealplans
        console.log(JSON.stringify(userWithMealplans, null, 2));
    } catch (err) {
        console.error(err);
    } finally {
        mongoose.disconnect();
    }
};

execScript();
