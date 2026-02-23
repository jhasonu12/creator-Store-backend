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
  updatePageSchema,
  reorderPagesSchema,
  createBlockSchema,
  updateBlockSchema,
  reorderBlocksSchema,
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

/**
 * @route PATCH /pages/:id
 * @desc Update a page
 * @access Private
 */
router.patch('/pages/:id', authMiddleware, validateRequest(updatePageSchema), storeBuilderController.updatePage);

/**
 * @route DELETE /pages/:id
 * @desc Delete a page
 * @access Private
 */
router.delete('/pages/:id', authMiddleware, storeBuilderController.deletePage);

/**
 * @route PATCH /stores/:storeId/pages/order
 * @desc Reorder pages (atomic operation)
 * @access Private
 */
router.patch('/:storeId/pages/order', authMiddleware, validateRequest(reorderPagesSchema), storeBuilderController.reorderPages);

// ========== BLOCK ROUTES (Sales Page Blocks) ==========

/**
 * @route GET /pages/:pageId/blocks
 * @desc Get all blocks for a page
 * @access Public
 */
router.get('/pages/:pageId/blocks', storeBuilderController.getBlocks);

/**
 * @route POST /pages/:pageId/blocks
 * @desc Create a new block
 * @access Private
 */
router.post('/pages/:pageId/blocks', authMiddleware, validateRequest(createBlockSchema), storeBuilderController.createBlock);

/**
 * @route PATCH /blocks/:id
 * @desc Update a block
 * @access Private
 */
router.patch('/blocks/:id', authMiddleware, validateRequest(updateBlockSchema), storeBuilderController.updateBlock);

/**
 * @route DELETE /blocks/:id
 * @desc Delete a block
 * @access Private
 */
router.delete('/blocks/:id', authMiddleware, storeBuilderController.deleteBlock);

/**
 * @route PATCH /pages/:pageId/blocks/order
 * @desc Reorder blocks (atomic operation)
 * @access Private
 */
router.patch('/pages/:pageId/blocks/order', authMiddleware, validateRequest(reorderBlocksSchema), storeBuilderController.reorderBlocks);

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
