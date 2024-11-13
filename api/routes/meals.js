import express from 'express';

import { verifyUser } from '../middleware/authorization.js';

import { getMealBySearch } from '../controllers/meal.js';

const router = express.Router();

const SPOONACULAR_API_URL = process.env.SPOON_API_URL;
const SPOONACULAR_API_KEY = process.env.SPOON_API_KEY;

router.use(verifyUser);

// GET /meals/search
router.get('/search', getMealBySearch);

export default router;
