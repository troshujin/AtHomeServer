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
