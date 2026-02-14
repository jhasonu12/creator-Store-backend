import { Router } from 'express';
import { AuthController } from './auth.controller';
import { validateRequest } from '@common/middleware/validation.middleware';
import { createUserSchema, loginSchema } from '@validators/user.validator';
import { authMiddleware } from '@common/middleware/auth.middleware';

const router = Router();
const authController = new AuthController();

/**
 * @route POST /auth/signup
 * @desc Register a new user
 * @access Public
 */
router.post('/signup', validateRequest(createUserSchema), authController.signup);

/**
 * @route POST /auth/creator-signup
 * @desc Register a new creator
 * @access Public
 */
router.post('/creator-signup', authController.signupAsCreator);

/**
 * @route POST /auth/login
 * @desc Login user
 * @access Public
 */
router.post('/login', validateRequest(loginSchema), authController.login);

/**
 * @route POST /auth/refresh
 * @desc Refresh access token
 * @access Public
 */
router.post('/refresh', authController.refreshToken);

/**
 * @route POST /auth/logout
 * @desc Logout user
 * @access Private
 */
router.post('/logout', authMiddleware, authController.logout);

export default router;
