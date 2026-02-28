import { Router } from 'express';
import { PublicController } from './public.controller';

const router = Router();
const publicController = new PublicController();

// ========== PUBLIC STORE ROUTES ==========

/**
 * @route GET /public/store/:slug
 * @desc Get public store by slug (no authentication required)
 * @access Public
 * @param slug - Store slug identifier
 */
router.get('/store/:slug', publicController.getStoreBySlug);

export default router;
