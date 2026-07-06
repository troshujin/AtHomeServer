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

/** Every workout across a group of people, flattened into a single feed ordered by recency. */
const toActivityFeed = (people: MockPerson[]): GymActivityEntry[] =>
  people
    .flatMap((person) => toWorkouts(person).map((workout) => ({ user: person.user, workout })))
    .sort(byMostRecentActivity);

export const mockFriendActivity: GymActivityEntry[] = toActivityFeed(mockFriends);

export const mockPromotedActivity: GymActivityEntry[] = toActivityFeed(mockCommunityMembers);

/**
 * The current user's own workouts are the only ones that can change at
 * runtime (create/update/delete), so they're the only ones kept as a live,
 * mutable store here - a single shared source of truth read by both
 * `useWorkout.ts` (the CRUD surface, scoped to "my workouts" the same way
 * the real backend is) and `useWorkoutDetail.ts` (which needs to resolve
 * *any* workout by id, including ones created seconds ago). Before this,
 * each of those kept its own separate copy, so a just-created workout was
 * invisible to the detail page it had just redirected to - the same class
 * of bug as two caches of "the same" data drifting apart.
 */
let myWorkouts: Workout[] = toWorkouts(mockCurrentPerson);

export const getMyWorkouts = (): Workout[] => myWorkouts;

export const findMyWorkoutById = (workoutId: string): Workout | undefined =>
  myWorkouts.find((workout) => workout.id === workoutId);

export const addMyWorkout = (workout: Workout): void => {
  myWorkouts = [workout, ...myWorkouts];
};

export const replaceMyWorkout = (workoutId: string, workout: Workout): void => {
  myWorkouts = myWorkouts.map((item) => (item.id === workoutId ? workout : item));
};

export const removeMyWorkout = (workoutId: string): void => {
  myWorkouts = myWorkouts.filter((item) => item.id !== workoutId);
};

export const findActivityByWorkoutId = (workoutId: string): GymActivityEntry | undefined => {
  const mine = findMyWorkoutById(workoutId);
  if (mine) return { user: mockCurrentPerson.user, workout: mine };

  return [...mockFriendActivity, ...mockPromotedActivity].find((entry) => entry.workout.id === workoutId);
};
