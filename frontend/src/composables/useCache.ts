import type { BaseEntity } from '@/types/base';
import type { CacheEntry } from '@/types/cache';
import { ref } from 'vue';

export const globalCache = new Map<string, CacheEntry<BaseEntity>>();

export default function useCache() {
  const getOrCreateEntry = <T>(key: string): CacheEntry<T> => {
    if (!globalCache.has(key)) {
      globalCache.set(key, {
        data: ref(null),
        isFetching: ref(false),
        lastFetch: 0,
      });
    }
    return globalCache.get(key) as CacheEntry<T>;
  };

  return { getOrCreateEntry };
}
