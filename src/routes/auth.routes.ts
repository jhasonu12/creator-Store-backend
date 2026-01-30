import { Router } from 'express';
import { AuthController } from '@controllers/auth.controller';
import { validateRequest } from '@middleware/validation';
import { createUserSchema, loginSchema } from '@validators/user.validator';

const router = Router();
const authController = new AuthController();

/**
 * @route POST /auth/register
 * @desc Register a new user
 * @access Public
 */
router.post('/register', validateRequest(createUserSchema), authController.register);

/**
 * @route POST /auth/login
 * @desc Login user
 * @access Public
 */
router.post('/login', validateRequest(loginSchema), authController.login);

/**
 * @route POST /auth/logout
 * @desc Logout user
 * @access Private
 */
router.post('/logout', authController.logout);

export default router;
