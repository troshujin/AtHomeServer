import type { Workout } from '@/types/gym';
import type { User } from '@/types/user';
import { useCachedApi } from '../api/useCacheApi';
import useCurrentUser, { toDisplayUser } from '../auth/useCurrentUser';
import useWorkouts, { HISTORY_PARAMS } from './useWorkout';
import { mockFriendActivity, mockPromotedActivity } from './mocks/workouts.mock';
import { byMostRecent } from './utils/useWorkoutUtils';
import { mockDelay, toMockResponse } from './utils/useMockApi';

export interface GymUserProfile {
  user: User;
  isMe: boolean;
  workouts: Workout[];
}

/**
 * Resolves a `/gym/users/:id` profile. The backend has no user-profile or
 * friends endpoint, so only two kinds of profile can exist right now: the
 * current user (real `/me` + `/workouts` data) and the mock friend/promoted
 * people the feeds link to. Anything else resolves to "not visible".
 */
export default function useUserProfile() {
  const { fetchMe } = useCurrentUser();
  const { fetchWorkouts } = useWorkouts();

  const fetchUserProfile = useCachedApi<GymUserProfile, [userId: string]>(
    (userId) => `gym_user_profile_${userId}`,
    async (userId) => {
      const mockEntries = [...mockFriendActivity, ...mockPromotedActivity].filter(
        (entry) => entry.user.id === userId,
      );
      if (mockEntries.length > 0) {
        await mockDelay();
        const workouts = mockEntries.map((entry) => entry.workout).sort(byMostRecent);
        return toMockResponse({ user: mockEntries[0]!.user, isMe: false, workouts });
      }

      await fetchMe.execute();
      const me = fetchMe.data.value;
      if (!me || me.id !== userId) {
        throw new Error('This user does not exist, or is not visible to you.');
      }

      await fetchWorkouts.execute(HISTORY_PARAMS);
      const workouts = [...(fetchWorkouts.data.value?.items ?? [])].sort(byMostRecent);
      // toMockResponse here just wraps in the AxiosResponse shape the cache
      // layer expects - the data above is real.
      return toMockResponse({ user: toDisplayUser(me), isMe: true, workouts });
    },
    // This aggregates the `me` and `workouts` caches, which already have
    // their own staleness - don't add a second layer on top.
    0,
  );

  return { fetchUserProfile };
}
