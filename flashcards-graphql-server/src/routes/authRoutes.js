import express from 'express';
import { loginLimiter } from '../middleware/loginLimiter.js';
import {
    handleLoginRequest,
    handleLogoutRequest,
    handleRefreshTokenRequest,
} from '../controllers/authController.js';
const authRouter = express.Router();

// /auth/login
authRouter.route('/login').post(loginLimiter, handleLoginRequest);

// /auth/refresh
authRouter.route('/refresh').get(handleRefreshTokenRequest);

// /auth/logout
authRouter.route('/logout').post(handleLogoutRequest);

export default authRouter;
