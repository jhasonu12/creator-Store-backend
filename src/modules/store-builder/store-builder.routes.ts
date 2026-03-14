import { Router } from 'express';
import { StoreBuilderController } from './store-builder.controller';
import { authMiddleware } from '@common/middleware/auth.middleware';
import { validateRequest } from '@common/middleware/validation.middleware';
import {
  updateStoreSchema,
  createSectionSchema,
  updateSectionSchema,
  reorderSectionsSchema,
  createPageSchema,
  updateThemeSchema,
} from '@validators/store-builder.validator';

const router = Router();
const storeBuilderController = new StoreBuilderController();

// ========== STORE ROUTES ==========

/**
 * @route GET /stores/self
 * @desc Get creator's store (created during signup)
 * @access Private
 */
router.get('/self', authMiddleware, storeBuilderController.getStore);

/**
 * @route PATCH /stores/:id
 * @desc Update store settings
 * @access Private
 */
router.patch('/:id', authMiddleware, validateRequest(updateStoreSchema), storeBuilderController.updateStore);

// ========== SECTION ROUTES (Link-in-bio) ==========

/**
 * @route GET /stores/:storeId/sections
 * @desc Get all sections for a store
 * @access Public
 */
router.get('/:storeId/sections', storeBuilderController.getSections);

/**
 * @route POST /stores/:storeId/sections
 * @desc Create a new section
 * @access Private
 */
router.post('/:storeId/sections', authMiddleware, validateRequest(createSectionSchema), storeBuilderController.createSection);

/**
 * @route PATCH /sections/:id
 * @desc Update a section
 * @access Private
 */
router.patch('/sections/:id', authMiddleware, validateRequest(updateSectionSchema), storeBuilderController.updateSection);

/**
 * @route DELETE /sections/:id
 * @desc Delete a section
 * @access Private
 */
router.delete('/sections/:id', authMiddleware, storeBuilderController.deleteSection);

/**
 * @route PATCH /stores/:storeId/sections/order
 * @desc Reorder sections (atomic operation)
 * @access Private
 */
router.patch('/:storeId/sections/order', authMiddleware, validateRequest(reorderSectionsSchema), storeBuilderController.reorderSections);

// ========== PAGE ROUTES (Product Landing Pages) ==========

/**
 * @route GET /stores/:storeId/pages
 * @desc Get all pages for a store
 * @access Public
 */
router.get('/:storeId/pages', storeBuilderController.getPages);

/**
 * @route POST /stores/:storeId/pages
 * @desc Create a new page
 * @access Private
 */
router.post('/:storeId/pages', authMiddleware, validateRequest(createPageSchema), storeBuilderController.createPage);

// ========== THEME ROUTES ==========

/**
 * @route GET /stores/:storeId/theme
 * @desc Get store theme configuration
 * @access Public
 */
router.get('/:storeId/theme', storeBuilderController.getTheme);

/**
 * @route PATCH /stores/:storeId/theme
 * @desc Update store theme configuration
 * @access Private
 */
router.patch('/:storeId/theme', authMiddleware, validateRequest(updateThemeSchema), storeBuilderController.updateTheme);

export default router;
