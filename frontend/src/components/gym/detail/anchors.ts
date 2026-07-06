// Shared between WorkoutExerciseSection (sets the id) and WorkoutExerciseNav
// (links to it) so the two can never drift out of sync.
export const exerciseAnchorId = (exerciseId: string): string => `exercise-${exerciseId}`;
