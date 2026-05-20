import Redis from 'ioredis';

let redisClient = null;
let isRedisReady = false;

const redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379';

if (process.env.NODE_ENV !== 'test') {
  try {
    redisClient = new Redis(redisUrl, {
      maxRetriesPerRequest: 1,
      retryStrategy(times) {
        // limit reconnection attempts so we don't spam logs if Redis isn't running
        if (times > 3) {
          return null; // stop retrying
        }
        return Math.min(times * 100, 2000);
      }
    });

    redisClient.on('connect', () => {
      console.log('⚡ Redis connected successfully');
    });

    redisClient.on('ready', () => {
      isRedisReady = true;
      console.log('✅ Redis ready — caching enabled');
    });

    redisClient.on('error', (err) => {
      isRedisReady = false;
      // log connection error only once or warn gracefully
      console.warn('⚠️ Redis connection failed: ', err.message);
    });

    redisClient.on('end', () => {
      isRedisReady = false;
    });
  } catch (err) {
    console.error('Failed to initialize Redis client:', err.message);
  }
}

export const getCache = async (key) => {
  if (!isRedisReady || !redisClient) return null;
  try {
    const value = await redisClient.get(key);
    return value ? JSON.parse(value) : null;
  } catch (err) {
    console.error(`Redis GET error for key ${key}:`, err.message);
    return null;
  }
};

export const setCache = async (key, value, ttlSeconds = 3600) => {
  if (!isRedisReady || !redisClient) return false;
  try {
    const serialized = JSON.stringify(value);
    await redisClient.set(key, serialized, 'EX', ttlSeconds);
    return true;
  } catch (err) {
    console.error(`Redis SET error for key ${key}:`, err.message);
    return false;
  }
};

export const deleteCache = async (key) => {
  if (!isRedisReady || !redisClient) return false;
  try {
    await redisClient.del(key);
    return true;
  } catch (err) {
    console.error(`Redis DEL error for key ${key}:`, err.message);
    return false;
  }
};

export const deletePatternCache = async (pattern) => {
  if (!isRedisReady || !redisClient) return false;
  try {
    let cursor = '0';
    do {
      const [newCursor, keys] = await redisClient.scan(cursor, 'MATCH', pattern, 'COUNT', 100);
      cursor = newCursor;
      if (keys.length > 0) {
        await redisClient.del(keys);
      }
    } while (cursor !== '0');
    return true;
  } catch (err) {
    console.error(`Redis scan/delete error for pattern ${pattern}:`, err.message);
    return false;
  }
};

export { redisClient, isRedisReady };
