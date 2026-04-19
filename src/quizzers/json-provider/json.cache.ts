const cache = new Map<string, unknown>();

export class JsonCache {
  // retrieve a value from cache else null
  static get<T>(key: string): T | null {
    const value = cache.get(key);
    return (value as T) ?? null;
  }

  // store value in the cache
  static set<T>(key: string, value: T): void {
    cache.set(key, value);
  }
  /**
   * Remove a specific entry from the cache.
   * Useful when data is updated.
   */
  static invalidate(key: string): void {
    cache.delete(key);
  }

  /**
   * Clear all cached data.
   */
  static clear(): void {
    cache.clear();
  }
}
