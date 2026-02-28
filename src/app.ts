import 'express-async-errors';
import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { StatusCodes } from 'http-status-codes';

import { config } from '@config/environment';
// import { initRedis } from '@config/redis';
import { requestLogger } from '@common/middleware/logger.middleware';
import { errorHandler } from '@common/middleware/errorHandler.middleware';

import authRoutes from '@modules/auth/auth.routes';
import userRoutes from '@modules/users/user.routes';
import storeSlugRoutes from '@modules/store-slugs/store-slug.routes';
import storeBuilderRoutes from '@modules/store-builder/store-builder.routes';
import productRoutes from '@modules/products/product.routes';
import publicRoutes from '@modules/public/public.routes';

import { logger } from '@common/utils/logger';
import { sendResponse } from '@common/utils/response';

export const createApp = (): Express => {
  const app = express();

  // Middleware: Security
  app.use(helmet());
  app.use(cors({ origin: config.cors.origin, credentials: true }));

  // Middleware: Body parsing
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ limit: '10mb', extended: true }));

  // Middleware: Logging
  if (config.app.nodeEnv === 'production') {
    app.use(morgan('combined'));
  } else {
    app.use(morgan('dev'));
  }
  app.use(requestLogger);

  // Health check endpoint
  app.get('/health', (req: Request, res: Response) => {
    sendResponse(res, StatusCodes.OK, 'Service is healthy', { timestamp: new Date() });
  });

  // API version endpoint
  app.get('/api/version', (req: Request, res: Response) => {
    sendResponse(res, StatusCodes.OK, 'API Version', { version: config.app.apiVersion });
  });

  // API Routes
  app.use(`/api/${config.app.apiVersion}/auth`, authRoutes);
  app.use(`/api/${config.app.apiVersion}/users`, userRoutes);
  app.use(`/api/${config.app.apiVersion}/store-slugs`, storeSlugRoutes);
  app.use(`/api/${config.app.apiVersion}/stores`, storeBuilderRoutes);
  app.use(`/api/${config.app.apiVersion}/products`, productRoutes);

  // Public Routes (no authentication required)
  app.use('/public', publicRoutes);

  // 404 handler
  app.use((req: Request, res: Response) => {
    sendResponse(res, StatusCodes.NOT_FOUND, `Route not found: ${req.path}`);
  });

  // Error handling middleware (must be last)
  app.use(errorHandler);

  return app;
};

export const startServer = async (): Promise<void> => {
  try {
    // Initialize database
    const { initializeDatabase, disconnectDatabase } = await import('@config/database');
    await initializeDatabase();

    // Initialize Redis (non-blocking - graceful degradation)
    // initRedis()
    //   .then(() => logger.info('Redis connected'))
    //   .catch((error) => logger.warn('Redis unavailable - running without cache', error));

    const app = createApp();
    const PORT = config.app.port;

    const server = app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT} in ${config.app.nodeEnv} mode`);
      logger.info(`API available at http://localhost:${PORT}/api/${config.app.apiVersion}`);
    });

    // Graceful shutdown handlers
    process.on('SIGTERM', async () => {
      logger.info('SIGTERM received: shutting down gracefully');
      server.close(async () => {
        await disconnectDatabase();
        logger.info('Server closed');
        process.exit(0);
      });
    });

    process.on('SIGINT', async () => {
      logger.info('SIGINT received: shutting down gracefully');
      server.close(async () => {
        await disconnectDatabase();
        logger.info('Server closed');
        process.exit(0);
      });
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};
