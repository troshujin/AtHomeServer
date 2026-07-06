import type { BaseEntity } from "./base";

/** Derived from `endedAt`: a workout without an end time is still going. */
export type WorkoutStatus = 'in-progress' | 'finished';

export interface Workout extends BaseEntity {
  name: string;
  exercises: WorkoutExercise[];
  startedAt: Date;
  /** Null while the workout is still in progress (mirrors the backend's nullable `ended_at`). */
  endedAt: Date | null;
}

export interface WorkoutExercise extends BaseEntity {
  name: string;
  sets: WorkoutSet[];
  startedAt: Date;
  /** Null while the exercise is still in progress (mirrors the backend's nullable `ended_at`). */
  endedAt: Date | null;
}

export interface WorkoutSet extends BaseEntity {
  reps: WorkoutRep[];
}

export interface WorkoutRep extends BaseEntity {
  /** Kilograms; half-kg steps are valid (the backend stores a float). */
  weight: number;
  amount: number;
}

export interface MutateWorkout {
  name: string;
  exercises: MutateWorkoutExercise[];
  startedAt: Date;
  endedAt: Date | null;
}

export interface MutateWorkoutExercise {
  name: string;
  sets: MutateWorkoutSet[];
  startedAt: Date;
  endedAt: Date | null;
}

export interface MutateWorkoutSet {
  reps: MutateWorkoutRep[];
}

export interface MutateWorkoutRep {
  /** Kilograms; half-kg steps are valid (the backend stores a float). */
  weight: number;
  amount: number;
}
