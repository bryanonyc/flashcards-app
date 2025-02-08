import jwt from 'jsonwebtoken';
import { logEvents } from './logger.js';
import { findUser } from '../controllers/authController.js';

const { TokenExpiredError } = jwt;

export const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader?.startsWith('Bearer ')) {
        const error = new Error(
            'Unauthorized. No token was provided with the request.'
        );
        error.status = 401;
        throw error;
    }

    const token = authHeader.split(' ')[1];
    try {
        jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET,
            async (err, decoded) => {
                try {
                    if (err) {
                        if (err instanceof TokenExpiredError) {
                            const error = new Error(
                                `Invalid token.  Token expired at ${err.expiredAt}`
                            );
                            error.status = 401;
                            throw error;
                        } else {
                            const error = new Error(
                                'Unknown error during token verification'
                            );
                            error.status = 500;
                            throw error;
                        }
                    }

                    // one last sanity check
                    const user = await findUser(decoded.username);
                    if (user === null) {
                        const error = new Error('No account found.');
                        error.status = 403;
                        throw error;
                    } else if (!user.isActive) {
                        const error = new Error('Your account is inactive.');
                        error.status = 403;
                        throw error;
                    } else {
                        next();
                    }
                } catch (error) {
                    logEvents(
                        `${error.name}: \t
                        ${error.message}\t
                        ${req.method}\t
                        ${req.url}\t
                        ${req.headers.origin}`,
                        'errors.log'
                    );
                }
            }
        );
    } catch (error) {
        logEvents(
            `${error.name}: \t
            ${error.message}\t
            ${req.method}\t
            ${req.url}\t
            ${req.headers.origin}`,
            'errors.log'
        );
        if (error instanceof TokenExpiredError) {
            const error = new Error(`${error.message}`);
            error.status = 500;
            throw error;
        }
    }
};

export const getUserInfoFromToken = async (req) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const userInfo = {
            username: decoded.username,
            isAdmin: decoded.isAdmin,
        };
        return userInfo;
    } catch (error) {
        logEvents(
            `${error.name}: \t
            ${error.message}\t
            ${req.method}\t
            ${req.url}\t
            ${req.headers.origin}`,
            'errors.log'
        );
    }
};
