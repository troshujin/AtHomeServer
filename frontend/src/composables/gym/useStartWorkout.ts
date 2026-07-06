import { useRouter } from 'vue-router';
import useWorkouts from './useWorkout';

/**
 * "Add workout" is persist-first: a blank in-progress workout (no end time,
 * no exercises) is POSTed immediately and the user lands straight on its
 * edit page, where autosave keeps every subsequent input flowing to the
 * backend. There is no local-only draft state to lose.
 */
export default function useStartWorkout() {
  const router = useRouter();
  const { createWorkout } = useWorkouts();

  const startWorkout = async () => {
    const startedAt = new Date();
    startedAt.setMinutes(Math.round(startedAt.getMinutes() / 5) * 5, 0, 0);

    const created = await createWorkout.execute({
      name: 'New workout',
      startedAt,
      endedAt: null,
      exercises: [],
    });

    await router.push(`/gym/workouts/${created.id}/edit`);
  };

  return { startWorkout, starting: createWorkout.loading };
}
