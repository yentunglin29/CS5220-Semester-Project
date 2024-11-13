import User from '../models/user.js';

import { hash, compare, signToken } from '../util/auth.js';

const registerUser = async (req, res) => {
    try {
        const { username, password, preferences = [] } = req.body;

        if (!username || !password) {
            return res.status(422).json({ error: 'Must provide both username and password' });
        }

        // Check if username already exists in the users array
        const isRegistered = User.users.find(user => user.username === username.toLowerCase());
        if (isRegistered) {
            return res.status(409).json({ error: 'Username already registered.' });
        }

        const hashedPassword = await hash(password);

        // Add the new user
        const user = User.add({
            username: username.toLowerCase(),
            password: hashedPassword,
            preferences
        });

        res.status(201).json({ _id: user._id, username: user.username, preferences: user.preferences });
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};

const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(422).json({ error: 'Must provide both username and password' });
        }

        // Find the user by username within the route itself
        const user = User.user.find(user => user.username === username.toLowerCase());

        if (!user) {
            return res.status(401).json({ error: 'Invalid username' });
        }

        const passwordEqual = await compare(password, user.password);
        if(!passwordEqual){
            return res.status(401).json({ error: 'Invalid password' });
        }

        const token = signToken(user.username, user._id)

        res.json({ 
            _id: user._id, 
            username: user.username, 
            preferences: user.preferences,
            token_type:'Bearer',
            access_token: token
        });
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};

const getUserById = async (req, res) => {
    try {
        const { user_id } = req.verified;
        const id = Number(req.params.id);

        // verify the requesting user (user_id) matches the url param id
        if (user_id !== id) {
            return res.status(403).json({ error: 'Forbidden user' });
        }

        // find the user by _id
        const user = User.find('_id', id);
        
        // get mealplans associated to the user by _id
        const mealplans = MealPlan.findAll(user_id);

        res.status(200).json({ username: user.username, preferences: user.preferences, mealplans });
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};

const putUserById = async (req, res) => {
    try {
        const { user_id } = req.verified;
        const id = Number(req.params.id);
        const { preferences } = req.body;

        // verify the requesting user (user_id) matches the url param id
        if (user_id !== id) {
            return res.status(403).json({ error: 'Forbidden user' });
        }

        // find the user by _id
        const user = User.find('_id', id);

        // optional - validate dietary preferences
        // const invalidPreferences = validatePreferences(preferences);
        // if (invalidPreferences.length) {
        //     return res
        //         .status(400)
        //         .json({ error: `Invalid dietary preferences: ${invalidPreferences}` });
        // }

        const updated = User.update(user_id, preferences);
        res.status(200).json({ username: user.username, preferences: updated.preferences });
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};

export { registerUser, loginUser, getUserById, putUserById };