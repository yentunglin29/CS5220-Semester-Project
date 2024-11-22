import express from 'express';

import { verifyUser } from '../middleware/authorization.js';

import { registerUser, loginUser, getUserById, putUserById } from '../controllers/user.js';

const router = express.Router();

// POST /users/register
router.post('/register', registerUser);

// POST /users/login
router.post('/login', loginUser);

// GET /users/:id
router.get('/:id', verifyUser, getUserById);

// PUT /users/:id
router.put('/:id', verifyUser, putUserById);

export default router;
