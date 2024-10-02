import axios from 'axios';
import express from 'express';

import { Users } from '../../db/mocks.js';
const router = express.Router();
const SPOONACULAR_API_KEY = process.env.SPOONACULAR_API_KEY;

router.get('/search', async (req, res) => {
    try {
        const { user_id } = req.headers;
        const { meal, diets } = req.query;

        const user = Users.find(parseInt(user_id));
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const dietPreferences = diets ? diets.split(',') : user.preferences;

        const apiUrl = `https://api.spoonacular.com/recipes/complexSearch?query=${meal}&diet=${dietPreferences.join(',')}&apiKey=${SPOONACULAR_API_KEY}`;
        const response = await axios.get(apiUrl);

        res.json(response.data.results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
