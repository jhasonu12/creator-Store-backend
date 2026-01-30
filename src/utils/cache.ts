import { getRedisClient } from '@config/redis';
import { config } from '@config/environment';

export const cacheGet = async (key: string): Promise<any> => {
  try {
    const redis = getRedisClient();
    const cached = await redis.get(key);
    return cached ? JSON.parse(cached) : null;
  } catch (error) {
    console.error('Cache get error:', error);
    return null;
  }
};

export const cacheSet = async (key: string, value: any, ttl?: number): Promise<void> => {
  try {
    const redis = getRedisClient();
    const serialized = JSON.stringify(value);
    await redis.setEx(key, ttl || config.redis.ttl, serialized);
  } catch (error) {
    console.error('Cache set error:', error);
  }
};

export const cacheDel = async (key: string): Promise<void> => {
  try {
    const redis = getRedisClient();
    await redis.del(key);
  } catch (error) {
    console.error('Cache delete error:', error);
  }
};

export const cacheInvalidatePattern = async (pattern: string): Promise<void> => {
  try {
    const redis = getRedisClient();
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(keys);
    }
  } catch (error) {
    console.error('Cache pattern invalidation error:', error);
  }
};

export const cacheGetOrSet = async <T>(
  key: string,
  fn: () => Promise<T>,
  ttl?: number
): Promise<T> => {
  const cached = await cacheGet(key);
  if (cached) return cached;

  const result = await fn();
  await cacheSet(key, result, ttl);
  return result;
};
