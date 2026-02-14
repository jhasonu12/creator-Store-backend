import { Router } from 'express';
import { UserController } from './user.controller';
import { authMiddleware } from '@common/middleware/auth.middleware';
import { validateRequest } from '@common/middleware/validation.middleware';
import { updateUserSchema, paginationSchema } from '@validators/user.validator';

const router = Router();
const userController = new UserController();

/**
 * @route GET /users/profile
 * @desc Get current user profile
 * @access Private
 */
router.get('/profile', authMiddleware, userController.getProfile);

/**
 * @route PUT /users/profile
 * @desc Update current user profile
 * @access Private
 */
router.put('/profile', authMiddleware, validateRequest(updateUserSchema), userController.updateProfile);

/**
 * @route DELETE /users/profile
 * @desc Delete current user account
 * @access Private
 */
router.delete('/profile', authMiddleware, userController.deleteProfile);

/**
 * @route GET /users
 * @desc Get all users (paginated)
 * @access Public
 */
router.get('/', validateRequest(paginationSchema), userController.getAllUsers);

/**
 * @route GET /users/:id
 * @desc Get user by ID
 * @access Public
 */
router.get('/:id', userController.getUser);

export default router;
