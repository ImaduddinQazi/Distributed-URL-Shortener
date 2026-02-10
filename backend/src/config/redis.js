const { Redis } = require('@upstash/redis');

let redis = null;

try {
  redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });
  
  console.log('✅ Redis client initialized');
} catch (error) {
  console.error('❌ Redis initialization failed:', error.message);
  console.log('⚠️  Continuing without cache...');
}

/**
 * Get value from Redis
 */
async function getCache(key) {
  if (!redis) return null;
  
  try {
    const value = await redis.get(key);
    return value;
  } catch (error) {
    console.error('Redis GET error:', error.message);
    return null;
  }
}

/**
 * Set value in Redis with TTL
 */
async function setCache(key, value, ttl = parseInt(process.env.REDIS_TTL || 3600)) {
  if (!redis) return false;
  
  try {
    await redis.set(key, value, { ex: ttl });
    return true;
  } catch (error) {
    console.error('Redis SET error:', error.message);
    return false;
  }
}

/**
 * Delete value from Redis
 */
async function deleteCache(key) {
  if (!redis) return false;
  
  try {
    await redis.del(key);
    return true;
  } catch (error) {
    console.error('Redis DEL error:', error.message);
    return false;
  }
}

/**
 * Check Redis connection
 */
async function pingRedis() {
  if (!redis) return false;
  
  try {
    const pong = await redis.ping();
    return pong === 'PONG';
  } catch (error) {
    console.error('Redis PING error:', error.message);
    return false;
  }
}

module.exports = {
  redis,
  getCache,
  setCache,
  deleteCache,
  pingRedis
};