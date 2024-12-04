import jwt from 'jsonwebtoken';
import { scrypt, randomBytes, timingSafeEqual } from 'crypto';

// run this command line: node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"
const JWT_SECRET = process.env.JWT_SECRET;
const KEYLEN = 32;

const hash = async (password) => {
    return new Promise((resolve, reject) => {
        const salt = randomBytes(16).toString('hex');

        scrypt(password, salt, KEYLEN, (err, derivedKey) => {
            if (err) {
                reject(err);
            }

            const derivedHex = derivedKey.toString('hex');
            console.log(`${salt}:${derivedHex}`);

            resolve(`${salt}:${derivedHex}`);
        });
    });
};

const compare = async (password, storedPassword) => {
    return new Promise((resolve, reject) => {
        // Split the stored password into salt and hash
        const [salt, storedHash] = storedPassword.split(':');
        if (!salt || !storedHash) {
            return resolve(false); // Return false if the format is incorrect
        }

        const hashBuffer = Buffer.from(storedHash, 'hex');

        // Hash the input password using the same salt
        scrypt(password, salt, KEYLEN, (err, derivedKey) => {
            if (err) return reject(err);

            const derivedBuffer = Buffer.from(derivedKey, 'hex');

            // Use timingSafeEqual to compare the stored hash with the derived hash
            const isEqual = timingSafeEqual(hashBuffer, derivedBuffer);
            resolve(isEqual);
        });
    });
};

// Middleware function to hash password within a User schema instance
export const hashUserPassword = async (user) => {
    if (user.isModified('password')) {
        user.password = await hash(user.password);
    }
};

const signToken = (username, _id) => {
    const user = { username, user_id: _id };
    return jwt.sign(user, JWT_SECRET, { expiresIn: '24h' });
};

const verifyToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
};

export { hash, compare, signToken, verifyToken };