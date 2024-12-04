// import mongoose from 'mongoose';
import axios from 'axios';
import Users from '../models/user.js';

const SPOON_API_URL = process.env.SPOON_API_URL;
const SPOON_API_KEY = process.env.SPOON_API_KEY;

const getMealPlanByMealId = async (req, res) => {
    try {
        const { user_id } = req.verified; // Extract user_id from verified token
        const { name, preferences } = req.query;

        // console.log('Query Parameters:', req.query);

        // Ensure user_id is provided
        if (!user_id) {
            return res.status(403).json({ error: 'Forbidden user' });
        }

        // Find the user by ID
        const user = await Users.findOne({ _id: user_id });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // optional - below
        // split the preferences into an array or set to an empty array
        const queryPreferences = preferences ? preferences.split(',') : [];
        // concat user preferences with preferences passed into query params
        const diet = [...user.preferences, ...queryPreferences].join(',');

        const response = await axios.get(`${SPOON_API_URL}/recipes/complexSearch`, {
            params: {
                apiKey: SPOON_API_KEY,
                query: name,
                diet,
                addRecipeInformation: true // boolean flag to return diets array
            }
        });
        console.log(`${SPOON_API_URL}/recipes/complexSearch`);
        console.log({
            apiKey: SPOON_API_KEY,
            query: name,
            diet,
            addRecipeInformation: true // boolean flag to return diets array
        });

        // Check if results exist and are not empty
        if (response.data.results && response.data.results.length > 0) {
            res.json(response.data.results);
        } else {
            // console.log('No recipes found for the given criteria');
            res.status(404).json({ message: 'No recipes found for the given criteria' });
        }
    } catch (error) {
        console.error('Error fetching recipes:', error.message);
        res.status(500).json({ error: error.toString() });
    }
};
export { getMealPlanByMealId };
