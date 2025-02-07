import jwt from 'jsonwebtoken';
import { logEvents } from './logger.js';
import { findUser } from '../controllers/authController.js';

const { TokenExpiredError } = jwt;

export const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({
            message: 'Unauhorized. No token was provided with the request.',
        });
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
                            return res.status(401).json({
                                message: `Invalid token.  Token expired at ${err.expiredAt}`,
                            });
                        } else {
                            return res.status(500).json({
                                message: `Unknown error during token verification.`,
                            });
                        }
                    }

                    // one last sanity check
                    const user = await findUser(decoded.username);
                    if (user === null) {
                        res.status(403).json({
                            message: 'No account found.',
                            isError: true,
                        });
                    } else if (!user.isActive) {
                        res.status(403).json({
                            message: 'Your account is inactive.',
                            isError: true,
                        });
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
            return { message: error.message };
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
