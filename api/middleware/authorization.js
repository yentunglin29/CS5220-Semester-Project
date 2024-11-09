/* eslint-disable camelcase */
import { verifyToken } from '../utils/auth.js';

import { Users } from '../../db/mocks.js';

// express.js middleware for verifying user token
const verifyUser = async (req, res, next) => {
    const { authorization } = req.headers;

    try {
        if (!authorization) {
            return res.status(401).json({ error: 'Unauthorized: no token provided' });
        }

        const [token_type, token] = authorization.split(' ');

        if (token_type !== 'Bearer' || !token) {
            return res.status(401).json({ error: 'Unauthorized: invalid token format' });
        }

        const verified = verifyToken(token);

        if (!verified) {
            return res.status(401).json({ error: 'Unauthorized: token is invalid or expired' });
        }

        const exists = Users.exists(verified.user_id);
        if (!exists) {
            return res.status(404).json({ error: 'User not found' });
        }

        req.verified = verified;

        // pass control to the next middleware or to route handler
        next();
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};

export { verifyUser };