import { createClient, RedisClientType } from 'redis';
import { config } from './environment';
import { logger } from '@utils/logger';

let redisClient: RedisClientType | null = null;

export const initRedis = async (): Promise<RedisClientType | null> => {
  try {
    redisClient = createClient({
      socket: {
        host: config.redis.host,
        port: config.redis.port,
      },
      password: config.redis.password || undefined,
      database: config.redis.db,
    });

    redisClient.on('error', (err) => logger.warn('Redis Client Error', err));
    redisClient.on('connect', () => logger.info('Redis Client Connected'));

    await redisClient.connect();
    return redisClient;
  } catch (error) {
    logger.warn('Failed to initialize Redis - running without cache', error);
    return null;
  }
};

export const getRedisClient = (): RedisClientType => {
  if (!redisClient) {
    throw new Error('Redis client not initialized. Make sure Redis is running.');
  }
  return redisClient;
};

export const isRedisAvailable = (): boolean => {
  return redisClient !== null;
};

export const disconnectRedis = async (): Promise<void> => {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
  }
};
