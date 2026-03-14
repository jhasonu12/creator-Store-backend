import { Router } from 'express';
import { authMiddleware } from '@common/middleware/auth.middleware';
import { validateRequest } from '@common/middleware/validation.middleware';
import {
  updatePageSchema,
  createBlockSchema,
  updateBlockSchema,
  reorderBlocksSchema,
} from '@validators/store-page.validator';
import { StorePageController } from './pages.controller';

const router = Router();
const storePageController = new StorePageController();

// ========== PAGE ROUTES ==========
/**
 * @route PATCH /pages/:id
 * @desc Update a page
 * @access Private
 */
router.patch('/:id', authMiddleware, validateRequest(updatePageSchema), storePageController.updatePage);

// ========== BLOCK ROUTES (Sales Page Blocks) ==========
// Note: Pages are deleted automatically when their associated product is deleted (CASCADE)

/**
 * @route GET /pages/:pageId/blocks
 * @desc Get all blocks for a page
 * @access Public
 */
router.get('/:pageId/blocks', storePageController.getBlocks);

/**
 * @route POST /pages/:pageId/blocks
 * @desc Create a new block
 * @access Private
 */
router.post('/:pageId/blocks', authMiddleware, validateRequest(createBlockSchema), storePageController.createBlock);

/**
 * @route PATCH /blocks/:id
 * @desc Update a block
 * @access Private
 */
router.patch('/blocks/:id', authMiddleware, validateRequest(updateBlockSchema), storePageController.updateBlock);

/**
 * @route DELETE /blocks/:id
 * @desc Delete a block
 * @access Private
 */
router.delete('/blocks/:id', authMiddleware, storePageController.deleteBlock);

/**
 * @route PATCH /pages/:pageId/blocks/order
 * @desc Reorder blocks (atomic operation)
 * @access Private
 */
router.patch('/:pageId/blocks/order', authMiddleware, validateRequest(reorderBlocksSchema), storePageController.reorderBlocks);

export default router;