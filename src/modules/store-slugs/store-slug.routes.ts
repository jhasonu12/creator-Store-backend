import { Router } from 'express';
import { StoreSlugController } from './store-slug.controller';
import { validateRequest } from '@common/middleware/validation.middleware';
import { checkSlugAvailabilitySchema } from '@validators/store-slug.validator';

const router = Router();
const storeSlugController = new StoreSlugController();

/**
 * @route GET /store-slugs/check
 * @desc Check if a store slug is available
 * @access Public
 * @query slug: string - The slug to check
 */
router.get('/check', validateRequest(checkSlugAvailabilitySchema), storeSlugController.checkSlugAvailability);

export default router;
