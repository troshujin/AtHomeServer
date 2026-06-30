import { useCachedApi } from '../api/useCacheApi';
import { useApiClient } from '../api/useApiClient';
import type { User } from '@/types/user';

const buildKey = (entryId?: string) => {
  const base = `me`;
  return entryId !== undefined ? base + `_${entryId}` : base;
};

const buildUrl = (entryId?: string) => {
  const base = `/me`;
  return entryId !== undefined ? base + `/${entryId}` : base;
};

export default function useCurrentUser() {
  const api = useApiClient();

  const fetchMe = useCachedApi<User, []>(
    () => buildKey(),
    () => api.get<User>(buildUrl()),
  );

  return { fetchMe };
}
