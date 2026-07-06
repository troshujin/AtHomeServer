import type { User } from '@/types/user';
import type { MutateWorkout, Workout } from '@/types/gym';
import { hydrateWorkout } from './hydrate';
import { rawWorkoutsByPerson, type RawWorkout } from './raw-workouts.mock';
import { mockCommunityMembers, mockFriends, type MockPerson } from './users.mock';

export interface GymActivityEntry {
  user: User;
  workout: Workout;
}

const toMutateWorkout = (raw: RawWorkout): MutateWorkout => ({
  name: raw.name,
  startedAt: new Date(raw.startedAt),
  endedAt: new Date(raw.endedAt),
  exercises: raw.exercises.map((exercise) => ({
    name: exercise.name,
    startedAt: new Date(exercise.startedAt),
    endedAt: new Date(exercise.endedAt),
    sets: exercise.sets.map((set) => ({
      reps: set.reps.map((rep) => ({ ...rep })),
    })),
  })),
});

const requireRawWorkout = (key: string): RawWorkout => {
  const raw = rawWorkoutsByPerson[key];
  if (!raw) throw new Error(`Missing mock workout data for "${key}"`);
  return raw;
};

const byMostRecent = (a: Workout, b: Workout) => b.startedAt.getTime() - a.startedAt.getTime();
const byMostRecentActivity = (a: GymActivityEntry, b: GymActivityEntry) => byMostRecent(a.workout, b.workout);

const toWorkouts = (person: MockPerson): Workout[] =>
  person.rawWorkoutKeys
    .map((key) => hydrateWorkout(toMutateWorkout(requireRawWorkout(key))))
    .sort(byMostRecent);

/** Every workout across a group of people, flattened into a single feed ordered by recency. */
const toActivityFeed = (people: MockPerson[]): GymActivityEntry[] =>
  people
    .flatMap((person) => toWorkouts(person).map((workout) => ({ user: person.user, workout })))
    .sort(byMostRecentActivity);

/**
 * The current user's own workouts now come from the real `/workouts`
 * endpoint (see useWorkout.ts). These two feeds are the only mock data
 * left: the backend has no friends or promoted endpoint yet, so there is
 * simply nothing to call. Every workout in them carries a `mock-` id
 * prefix (via hydrateWorkout), which is how useWorkoutDetail.ts tells
 * them apart from real, backend-owned workout ids.
 */
export const mockFriendActivity: GymActivityEntry[] = toActivityFeed(mockFriends);

export const mockPromotedActivity: GymActivityEntry[] = toActivityFeed(mockCommunityMembers);

export const findActivityByWorkoutId = (workoutId: string): GymActivityEntry | undefined =>
  [...mockFriendActivity, ...mockPromotedActivity].find((entry) => entry.workout.id === workoutId);
