import type { AxiosResponse } from 'axios';
import { useCachedApi } from '@/composables/api/useCacheApi';

/**
 * Helpers for the feeds that still have no backend endpoint (friends and
 * promoted - see useFriends.ts / usePromoted.ts). They return
 * `AxiosResponse`-shaped data, matching the real client's contract so the
 * eventual swap to live HTTP calls only touches the composables themselves.
 */
const MOCK_LATENCY_MS = 350;

export const mockDelay = (ms: number = MOCK_LATENCY_MS): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const toMockResponse = <T>(data: T): AxiosResponse<T> =>
  ({ data, status: 200, statusText: 'OK', headers: {}, config: {} }) as AxiosResponse<T>;

export function useMockActivityFeed<T>(cacheKey: string, getData: () => T) {
  return useCachedApi<T, []>(
    () => cacheKey,
    async () => {
      await mockDelay();
      return toMockResponse(getData());
    },
  );
}
