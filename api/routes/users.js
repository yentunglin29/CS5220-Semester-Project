// import axios from 'axios';
import express from 'express';

import { Users, MealPlans } from '../../db/mocks.js';

const router = express.Router();

// POST /users/register
router.post('/register', async (req, res) => {
    try {
        const { username, password, preferences = [] } = req.body;

        if (!username || !password) {
            return res.status(422).json({ error: 'Must provide both username and password' });
        }

        // Check if username already exists in the users array
        const isRegistered = Users.users.find(user => user.username === username.toLowerCase());
        if (isRegistered) {
            return res.status(409).json({ error: 'Username already registered.' });
        }

        // Add the new user
        const user = Users.add({
            username: username.toLowerCase(),
            password,
            preferences
        });

        res.status(201).json({ _id: user._id, username: user.username, preferences: user.preferences });
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
});

// POST /users/login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(422).json({ error: 'Must provide both username and password' });
        }

        // Find the user by username within the route itself
        const user = Users.users.find(user => user.username === username.toLowerCase());

        if (!user || user.password !== password) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        res.json({ _id: user._id, username: user.username, preferences: user.preferences });
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
});

// GET /users/:id
router.get('/:id', async(req, res) => {
    try {
        const { id } = req.params;
        const { user_id } = req.headers;

        if (id !== user_id) {
            return res.status(403).json({ error: 'Forbidden: User ID mismatch.' });
        }

        const user = Users.find(parseInt(id));
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Retrieve associated meal plans
        const mealPlans = MealPlans.mealplans.filter(mealplan => mealplan.user_id === user._id);

        // Respond with the user object, excluding the password, and meal plans
        res.json({
            _id: user._id,
            username: user.username,
            preferences: user.preferences,
            mealPlans: mealPlans.map(plan => ({
                week: plan.week,
                meals: plan.meals
            }))
        });
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
});

// PUT /users/:id
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { user_id } = req.headers;
        const { preferences } = req.body;

        if (id !== user_id) {
            return res.status(403).json({ error: 'Forbidden: User ID mismatch.' });
        }

        const user = Users.find(parseInt(id));
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user.preferences = preferences || user.preferences;
        Users.update(user);

        res.json({ _id: user._id, username: user.username, preferences: user.preferences });
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
});

export default router;
