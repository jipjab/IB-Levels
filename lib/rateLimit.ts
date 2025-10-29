// Rate limiting utility for API routes
// Prevents API abuse and protects against excessive requests

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// In-memory store for rate limiting
// For production with multiple instances, consider Redis
const rateLimitStore = new Map<string, RateLimitEntry>();

// Clean up old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

/**
 * Rate limiter using token bucket algorithm
 * @param identifier - Unique identifier (IP address or user ID)
 * @param limit - Maximum requests per window
 * @param windowMs - Time window in milliseconds
 * @returns Rate limit result with success status and metadata
 */
export const rateLimit = (
  identifier: string,
  limit: number = 60,
  windowMs: number = 60 * 1000 // 1 minute default
): RateLimitResult => {
  const now = Date.now();
  const entry = rateLimitStore.get(identifier);

  // No entry or expired entry
  if (!entry || now > entry.resetTime) {
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime: now + windowMs,
    });

    return {
      success: true,
      limit,
      remaining: limit - 1,
      reset: now + windowMs,
    };
  }

  // Increment count
  entry.count++;

  // Check if limit exceeded
  if (entry.count > limit) {
    return {
      success: false,
      limit,
      remaining: 0,
      reset: entry.resetTime,
    };
  }

  return {
    success: true,
    limit,
    remaining: limit - entry.count,
    reset: entry.resetTime,
  };
};

/**
 * Get client IP address from request headers
 * Handles various proxy scenarios (Vercel, Cloudflare, etc.)
 */
export const getClientIp = (headers: Headers): string => {
  // Try various headers in order of preference
  const forwardedFor = headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }

  const realIp = headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }

  const cfConnectingIp = headers.get('cf-connecting-ip');
  if (cfConnectingIp) {
    return cfConnectingIp;
  }

  // Fallback
  return 'unknown';
};

/**
 * Create rate limit headers for HTTP response
 */
export const createRateLimitHeaders = (result: RateLimitResult): Record<string, string> => {
  return {
    'X-RateLimit-Limit': result.limit.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': new Date(result.reset).toISOString(),
  };
};

