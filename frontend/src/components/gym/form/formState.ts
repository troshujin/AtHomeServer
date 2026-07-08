// Local editing state for the create/edit form. Mirrors the real data
// model's shape (a set holds a list of weight+reps pairs, for drop sets)
// rather than flattening it - a set defaults to exactly one rep row so the
// common case (a plain set) stays a single kg/reps pair, and "+ Add drop"
// is opt-in for anyone who actually wants to log a multi-step set.
export interface RepFormState {
  id: string;
  weight: number | null;
  amount: number | null;
}

export interface SetFormState {
  id: string;
  reps: RepFormState[];
}

export interface ExerciseFormState {
  id: string;
  name: string;
  sets: SetFormState[];
  // Minutes spent on this exercise; the end time is always derived as
  // start + duration, so this is the number that has to stay authoritative.
  durationMinutes: number;
  // "HH:mm" once the user has typed a start time themselves; null means the
  // chained value (workout start for the first exercise, the previous
  // exercise's end for the rest) is only an initial hint that keeps
  // following its anchor until the user pins one down.
  startTime: string | null;
}

// The whole form's reactive state - owned by GymWorkoutForm.vue and shared
// (by reference) with WorkoutMode.vue, so the full-screen logging interface
// and the normal form edit the exact same data and switching between them
// never loses anything.
export interface WorkoutFormState {
  name: string;
  startedAt: string;
  endedAt: string;
  exercises: ExerciseFormState[];
}

/** A set counts as "done" once it has at least one complete weight+reps pair. */
export const isCompletedSet = (set: SetFormState): boolean =>
  set.reps.some((rep) => rep.weight !== null && rep.amount !== null && rep.amount >= 1);

/**
 * Whether the form has enough content to actually be saved: a name, and at
 * least one named exercise with a completed set. Mirrors the shape of
 * GymWorkoutForm.vue's `buildPayload` validation (name + non-empty
 * `collectExercises` result) without needing that function's timing-chain
 * resolution - used to decide whether an "end workout now" action should
 * even be offered, before a save is attempted.
 */
export const hasValidPayload = (form: WorkoutFormState): boolean =>
  form.name.trim().length > 0 &&
  form.exercises.some(
    (exercise) => exercise.name.trim().length > 0 && exercise.sets.some(isCompletedSet),
  );

export const createRepFormState = (weight: number | null = null, amount: number | null = null): RepFormState => ({
  id: crypto.randomUUID(),
  weight,
  amount,
});

export const createSetFormState = (reps?: RepFormState[]): SetFormState => ({
  id: crypto.randomUUID(),
  reps: reps && reps.length > 0 ? reps : [createRepFormState()],
});

export const createExerciseFormState = (name = '', durationMinutes = 10): ExerciseFormState => ({
  id: crypto.randomUUID(),
  name,
  sets: [createSetFormState()],
  durationMinutes,
  startTime: null,
});
