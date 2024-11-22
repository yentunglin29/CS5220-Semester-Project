import User from '../models/user.js';

import { hash, compare, signToken } from '../utils/auth.js';

const registerUser = async (req, res) => {
    try {
        const { username, password, preferences = [] } = req.body;

        if (!username || !password) {
            return res.status(422).json({ error: 'Must provide both username and password' });
        }

        // Check if username already exists in the database
        const isRegistered = await User.findOne({ username: username.toLowerCase() });
        if (isRegistered) {
            return res.status(409).json({ error: 'Username already registered.' });
        }

        const hashedPassword = await hash(password);

        // Create a new user in the database
        const newUser = new User({
            username: username.toLowerCase(),
            password: hashedPassword,
            preferences
        });

        // Save the new user to the database
        await newUser.save();
        
        res.status(201).json({ _id: newUser._id, username: newUser.username, preferences: newUser.preferences });
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

        // Find the user by username using Mongoose
        const user = await User.findOne({ username: username.toLowerCase() });

        if (!user) {
            return res.status(401).json({ error: 'Invalid username' });
        }

        // Compare the provided password with the hashed password in the database
        const passwordEqual = await compare(password, user.password);
        if (!passwordEqual) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        // Generate a JWT token
        const token = signToken(user.username, user._id);

        res.json({
            _id: user._id,
            username: user.username,
            preferences: user.preferences,
            token_type: 'Bearer',
            access_token: token
        });
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};

const getUserById = async (req, res) => {
    try {
        const { user_id } = req.verified; // Extract user_id from the verified token
        const { id } = req.params; // Extract the ID from the URL parameter

        // Ensure the requesting user matches the ID in the URL
        if (String(user_id) !== String(id)) {
            return res.status(403).json({ error: 'Forbidden user' });
        }

        // Fetch the user details and populate associated meal plans
        const user = await User.findById(user_id)
            .select('-password') // Exclude the password
            .populate('mealplans'); // Populate meal plans automatically

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({
            username: user.username,
            preferences: user.preferences,
            mealplans: user.mealplans
        });
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};

const putUserById = async (req, res) => {
    try {
        const { user_id } = req.verified; // user_id from the JWT token
        const { id } = req.params; // user ID from the URL
        const { preferences } = req.body; // new preferences to update

        // Verify that the requesting user matches the user ID in the URL
        if (user_id !== id) {
            return res.status(403).json({ error: 'Forbidden user' });
        }

        // Update the user's preferences using Mongoose
        const updatedUser = await User.findByIdAndUpdate(
            id,
            { preferences },
            { new: true } // Return the updated document
        );

        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ username: updatedUser.username, preferences: updatedUser.preferences });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export { registerUser, loginUser, getUserById, putUserById };
