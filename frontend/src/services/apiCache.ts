/**
 * Swiss Modernism 2.0 In-Memory API Cache & Request Deduplication
 * 
 * Provides:
 * - TTL-based in-memory caching for catalog data (Tours, Destinations, Flights, Airlines)
 * - In-flight promise deduplication (prevents redundant concurrent HTTP requests)
 * - Fine-grained pattern-based cache invalidation on mutations (create/update/delete/save)
 * - Zero external dependencies, ultra-lightweight
 */

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

class ApiCacheService {
  private cache = new Map<string, CacheEntry<unknown>>();
  private inFlight = new Map<string, Promise<unknown>>();

  /**
   * Fetch with automatic cache hit and in-flight deduplication
   */
  async fetchWithCache<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttlMs: number = 60_000 // default 60s
  ): Promise<T> {
    // 1. Check in-memory cache
    const now = Date.now();
    const cached = this.cache.get(key) as CacheEntry<T> | undefined;
    if (cached && cached.expiresAt > now) {
      return cached.data;
    }

    // 2. Check in-flight concurrent request deduplication
    const existingPromise = this.inFlight.get(key) as Promise<T> | undefined;
    if (existingPromise) {
      return existingPromise;
    }

    // 3. Execute fetcher and register in-flight promise
    const promise = (async () => {
      try {
        const data = await fetcher();
        this.cache.set(key, { data, expiresAt: Date.now() + ttlMs });
        return data;
      } finally {
        this.inFlight.delete(key);
      }
    })();

    this.inFlight.set(key, promise);
    return promise;
  }

  /**
   * Invalidate specific key or keys matching a regex/prefix
   */
  invalidate(pattern: string | RegExp): void {
    if (typeof pattern === 'string') {
      for (const key of Array.from(this.cache.keys())) {
        if (key === pattern || key.startsWith(pattern)) {
          this.cache.delete(key);
        }
      }
    } else {
      for (const key of Array.from(this.cache.keys())) {
        if (pattern.test(key)) {
          this.cache.delete(key);
        }
      }
    }
  }

  /**
   * Clear entire cache
   */
  clear(): void {
    this.cache.clear();
    this.inFlight.clear();
  }

  /**
   * Get size of current cache for diagnostics
   */
  get size(): number {
    return this.cache.size;
  }
}

export const apiCache = new ApiCacheService();
export default apiCache;
