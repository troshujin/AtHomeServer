import { useCachedApi } from '../api/useCacheApi';
import { useApiClient } from '../api/useApiClient';
import { formatUserName } from '@/lib/formatters';
import type { CurrentUser, User } from '@/types/user';

/**
 * The displayable `User` for content owned by the `/me` identity - used
 * wherever a byline/profile component expects the gym-side `User` shape
 * (UserBadge, WorkoutCard) but the person is the current user.
 */
export const toDisplayUser = (me: CurrentUser): User => ({
  id: me.id,
  username: formatUserName(me),
  createdAt: me.createdOn,
  updatedAt: me.createdOn,
});

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

  const fetchMe = useCachedApi<CurrentUser, []>(
    () => buildKey(),
    () => api.get<CurrentUser>(buildUrl()),
  );

  // Always hits the network (never the cache) and never triggers the global
  // 401/403 redirect/toast - a failure here just means "not logged in yet",
  // which is the expected outcome most of the time this is called.
  const probeMe = () => api.get<CurrentUser>(buildUrl(), { silent: true });

  return { fetchMe, probeMe };
}
