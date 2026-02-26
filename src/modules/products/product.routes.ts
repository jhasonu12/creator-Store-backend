import { Router } from 'express';
import { ProductController } from './product.controller';
import { authMiddleware } from '@common/middleware/auth.middleware';
import { validateRequest } from '@common/middleware/validation.middleware';
import {
  createProductSchema,
  updateProductSchema,
  getProductSchema,
  deleteProductSchema,
  updateStatusSchema,
  reorderProductsSchema,
} from '@validators/product.validator';

const router = Router();
const productController = new ProductController();

/**
 * @route GET /api/v1/products
 * @desc Get all products for the authenticated creator
 * @access Private
 */
router.get('/', authMiddleware, productController.getProducts);

/**
 * @route POST /api/v1/products
 * @desc Create a new product
 * @access Private
 */
router.post('/', authMiddleware, validateRequest(createProductSchema), productController.createProduct);

/**
 * @route PATCH /api/v1/products/reorder
 * @desc Reorder products for the authenticated creator
 * @access Private
 */
router.patch('/reorder', authMiddleware, validateRequest(reorderProductsSchema), productController.reorderProducts);

/**
 * @route GET /api/v1/products/:id
 * @desc Get a single product
 * @access Public
 */
router.get('/:id', validateRequest(getProductSchema), productController.getProduct);

/**
 * @route PATCH /api/v1/products/:id/status
 * @desc Update product status (DRAFT, PUBLISHED, ARCHIVED)
 * @access Private
 */
router.patch('/:id/status', authMiddleware, validateRequest(updateStatusSchema), productController.updateStatus);

/**
 * @route PATCH /api/v1/products/:id
 * @desc Update a product
 * @access Private
 */
router.patch('/:id', authMiddleware, validateRequest(updateProductSchema), productController.updateProduct);

/**
 * @route DELETE /api/v1/products/:id
 * @desc Delete a product
 * @access Private
 */
router.delete('/:id', authMiddleware, validateRequest(deleteProductSchema), productController.deleteProduct);

export default router;
