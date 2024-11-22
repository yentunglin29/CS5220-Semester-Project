/*
    steps to run:
    1. install dependencies: npm install
    2. start the server with nodemon: npm run dev
*/

import 'dotenv/config';
import express from 'express';

import mongodb from './db/connection.js';

import usersRoutes from './routes/users.js';
import mealPlansRoutes from './routes/mealplans.js';
import mealsRoutes from './routes/meals.js';

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.set('json spaces', 2);

// Use the routes
app.use('/users', usersRoutes);
app.use('/mealplans', mealPlansRoutes);
app.use('/meals', mealsRoutes);

// Server setup

app.listen(PORT, async() => {
    // connecting to mongo db before starting the server
    await mongodb.connect();
    
    console.log(`Server running on http://localhost:${PORT}`);
});