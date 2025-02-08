import jwt from 'jsonwebtoken';
import { logEvents } from './logger.js';
import { findUser } from '../controllers/authController.js';
import { isNil } from 'ramda';

const { TokenExpiredError } = jwt;

export const verifyJWT = async (req, res) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    const token = authHeader?.split(' ')[1];
    if (
        isNil(token) ||
        token === 'null' ||
        !authHeader?.startsWith('Bearer ')
    ) {
        const error = new Error(
            'Unauthorized. No token was provided with the request.'
        );
        error.status = 401;
        logEvents(
            `${error.name}: \t
            ${error.message}\t
            ${req.method}\t
            ${req.url}\t
            ${req.headers.origin}`,
            'errors.log'
        );
        throw error;
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await findUser(decoded.username);
        if (user === null) {
            const error = new Error('No account found.');
            error.status = 403;
            throw error;
        } else if (!user.isActive) {
            const error = new Error('Your account is inactive.');
            error.status = 403;
            throw error;
        }
        console.log('JWT has been verified successfully');
    } catch (err) {
        console.log('Error occured during validation of JWT', err);
        logEvents(
            `${err.name}: \t
            ${err.message}\t
            ${req.method}\t
            ${req.url}\t
            ${req.headers.origin}`,
            'errors.log'
        );
        if (err instanceof TokenExpiredError) {
            const error = new Error(
                `Invalid token.  Token expired at ${err.expiredAt}`
            );
            error.status = 401;
            throw error;
        } else {
            const error = new Error(
                `Error occurred during token verification: ${err.message}`
            );
            error.status = 403;
            throw error;
        }
    }
};
