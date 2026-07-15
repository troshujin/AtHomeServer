import type { ShortUrl } from '@/types/relations';
import { useApiClient } from './api/useApiClient';
import { useMutation } from './api/useCacheApi';

/**
 * Mints a 30-minute short link (`/api/short/<hash>`) for a same-domain URL -
 * what the add-friend QR encodes. Deliberately uncached: every call is a
 * fresh hash with a fresh TTL.
 */
export default function useShortUrl() {
  const api = useApiClient();

  const createShortUrl = useMutation<ShortUrl, [url: string, method?: string]>((url, method) =>
    api.post<ShortUrl, { url: string; method: string }>('/short', {
      url,
      method: method ?? 'GET',
    }),
  );

  return { createShortUrl };
}
