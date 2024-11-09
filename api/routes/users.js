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
router.get('/:id', async (req, res) => {
    try {
        const user_id = Number(req.headers.user_id);
        const id = Number(req.params.id);

        // verify the requesting user (user_id) matches the url param id
        if (user_id !== id) {
            return res.status(403).json({ error: 'Forbidden user' });
        }

        // find the user by _id
        const user = Users.find('_id', id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // get mealplans associated to the user by _id
        const mealplans = MealPlans.findAll(user._id);
        res.status(200).json({ username: user.username, preferences: user.preferences, mealplans });
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
});

// PUT /users/:id
router.put('/:id', async (req, res) => {
    try {
        const user_id = Number(req.headers.user_id);
        const id = Number(req.params.id);
        const { preferences } = req.body;

        // verify the requesting user (user_id) matches the url param id
        if (user_id !== id) {
            return res.status(403).json({ error: 'Forbidden user' });
        }

        // find the user by _id
        const user = Users.find('_id', id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // optional - validate dietary preferences
        const invalidPreferences = validatePreferences(preferences);
        if (invalidPreferences.length) {
            return res
                .status(400)
                .json({ error: `Invalid dietary preferences: ${invalidPreferences}` });
        }

        const updated = Users.update(user._id, preferences);
        res.status(200).json({ username: user.username, preferences: updated.preferences });
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
});

export default router;
