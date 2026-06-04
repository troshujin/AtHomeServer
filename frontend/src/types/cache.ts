import type { Ref } from 'vue';

export interface CacheEntry<T> {
  data: Ref<T | null>;
  isFetching: Ref<boolean>;
  // error: Ref<string | null>;
  lastFetch: number;
}
