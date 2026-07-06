import type {
  MutateWorkout,
  MutateWorkoutExercise,
  MutateWorkoutRep,
  MutateWorkoutSet,
  Workout,
  WorkoutExercise,
  WorkoutRep,
  WorkoutSet,
} from '@/types/gym';

let sequence = 0;
const nextId = (prefix: string): string => {
  sequence += 1;
  return `mock-${prefix}-${sequence}`;
};

const hydrateRep = (rep: MutateWorkoutRep, at: Date): WorkoutRep => ({
  ...rep,
  id: nextId('rep'),
  createdAt: at,
  updatedAt: at,
});

const hydrateSet = (set: MutateWorkoutSet, at: Date): WorkoutSet => ({
  id: nextId('set'),
  createdAt: at,
  updatedAt: at,
  reps: set.reps.map((rep) => hydrateRep(rep, at)),
});

const hydrateExercise = (exercise: MutateWorkoutExercise): WorkoutExercise => ({
  id: nextId('exercise'),
  name: exercise.name,
  startedAt: exercise.startedAt,
  endedAt: exercise.endedAt,
  createdAt: exercise.startedAt,
  updatedAt: exercise.endedAt ?? exercise.startedAt,
  sets: exercise.sets.map((set) => hydrateSet(set, exercise.startedAt)),
});

/** Promotes a `Mutate*` payload (create/update shape, or a mock fixture) into a full entity. */
export const hydrateWorkout = (workout: MutateWorkout): Workout => ({
  id: nextId('workout'),
  name: workout.name,
  startedAt: workout.startedAt,
  endedAt: workout.endedAt,
  createdAt: workout.startedAt,
  updatedAt: workout.endedAt ?? workout.startedAt,
  exercises: workout.exercises.map(hydrateExercise),
});
