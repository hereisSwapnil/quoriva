import redis from './redis';

/**
 * redis-backed rate limiter
 * @param ip user identifier (IP address)
 * @param action identifier for the action (e.g., 'search', 'openai')
 * @param limit maximum requests allowed in the window
 * @param windowSeconds size of the time window in seconds
 * @returns {Promise<{ isLimited: boolean, remaining: number }>}
 */
export async function isRateLimited(
  ip: string,
  action: string,
  limit: number,
  windowSeconds: number = 60
): Promise<{ isLimited: boolean; remaining: number }> {
  const key = `quoriva:ratelimit:${ip}:${action}`;

  // Fixed window rate limiting
  const current = await redis.get(key);
  const count = current ? parseInt(current, 10) : 0;

  if (count >= limit) {
    return { isLimited: true, remaining: 0 };
  }

  // Increment and set expiry if new
  const multi = redis.multi();
  multi.incr(key);
  if (!current) {
    multi.expire(key, windowSeconds);
  }
  const results = await multi.exec();
  
  const newCount = (results?.[0]?.[1] as number) || count + 1;
  const remaining = Math.max(0, limit - newCount);

  return { isLimited: false, remaining };
}
