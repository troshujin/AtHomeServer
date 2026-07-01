import type { AxiosResponse } from 'axios';
import { useCachedApi } from '@/composables/api/useCacheApi';

/**
 * There is no backend to talk to yet, so these helpers stand in for `useApiClient`
 * while still returning `AxiosResponse`-shaped data, matching the real client's
 * contract so swapping back to live HTTP calls later only touches this file.
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
