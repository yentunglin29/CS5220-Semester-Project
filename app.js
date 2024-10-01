/*
    steps to run:
    1. install dependencies: npm install
    2. start the server with nodemon: npm run dev
*/

import 'dotenv/config';
import express from 'express';

import usersRoutes from './api/routes/users.js';
import mealPlansRoutes from './api/routes/mealplans.js';
import mealsRoutes from './api/routes/meals.js';

const app = express();
const PORT = 8080;

app.use(express.json());

// Use the routes
app.use('/users', usersRoutes);
app.use('/mealplans', mealPlansRoutes);
app.use('/meals', mealsRoutes);

// Server setup

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});