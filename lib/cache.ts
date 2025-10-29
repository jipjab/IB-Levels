// Simple in-memory cache for API responses
// For production with multiple instances, consider Redis or Next.js ISR

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

class MemoryCache {
  private cache = new Map<string, CacheEntry<any>>();
  private defaultTTL: number;

  constructor(defaultTTL: number = 300000) { // 5 minutes default
    this.defaultTTL = defaultTTL;
    
    // Clean up expired entries every minute
    setInterval(() => {
      this.cleanup();
    }, 60000);
  }

  /**
   * Get item from cache
   * @param key - Cache key
   * @returns Cached data or null if not found or expired
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    // Check if expired
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  /**
   * Set item in cache
   * @param key - Cache key
   * @param data - Data to cache
   * @param ttl - Time to live in milliseconds (optional)
   */
  set<T>(key: string, data: T, ttl?: number): void {
    const now = Date.now();
    const timeToLive = ttl || this.defaultTTL;

    this.cache.set(key, {
      data,
      timestamp: now,
      expiresAt: now + timeToLive,
    });
  }

  /**
   * Check if key exists and is not expired
   */
  has(key: string): boolean {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return false;
    }

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  /**
   * Delete item from cache
   */
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Clean up expired entries
   */
  private cleanup(): void {
    const now = Date.now();
    let cleanedCount = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
        cleanedCount++;
      }
    }

    if (cleanedCount > 0 && process.env.NODE_ENV === 'development') {
      console.log(`[Cache] Cleaned up ${cleanedCount} expired entries`);
    }
  }

  /**
   * Get cache statistics
   */
  getStats() {
    const now = Date.now();
    let validEntries = 0;
    let expiredEntries = 0;

    for (const entry of this.cache.values()) {
      if (now > entry.expiresAt) {
        expiredEntries++;
      } else {
        validEntries++;
      }
    }

    return {
      total: this.cache.size,
      valid: validEntries,
      expired: expiredEntries,
    };
  }
}

// Singleton instance
const cache = new MemoryCache(
  parseInt(process.env.CACHE_DURATION || '300') * 1000
);

export default cache;

/**
 * Generate cache key from parameters
 */
export const generateCacheKey = (
  prefix: string,
  params: Record<string, any>
): string => {
  const sortedParams = Object.keys(params)
    .sort()
    .map(key => `${key}=${params[key]}`)
    .join('&');
  
  return `${prefix}:${sortedParams}`;
};

