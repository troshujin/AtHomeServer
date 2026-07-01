import type { User } from '@/types/user';
import type { MutateWorkout, Workout } from '@/types/gym';
import { hydrateWorkout } from './hydrate';
import { rawWorkoutsByPerson, type RawWorkout } from './raw-workouts.mock';
import { mockCommunityMembers, mockCurrentPerson, mockFriends, type MockPerson } from './users.mock';

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

const toLatestActivity = (person: MockPerson): GymActivityEntry => {
  const [workout] = toWorkouts(person);
  if (!workout) throw new Error(`Person "${person.user.username}" has no mock workouts.`);
  return { user: person.user, workout };
};

export const mockMyWorkouts: Workout[] = toWorkouts(mockCurrentPerson);

export const mockFriendActivity: GymActivityEntry[] = mockFriends.map(toLatestActivity).sort(byMostRecentActivity);

export const mockPromotedActivity: GymActivityEntry[] = mockCommunityMembers
  .map(toLatestActivity)
  .sort(byMostRecentActivity);
