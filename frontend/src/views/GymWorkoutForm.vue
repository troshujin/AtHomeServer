<template>
  <div class="workout-form-page">
    <RouterLink class="workout-form-page__back" :to="backLink">
      <span aria-hidden="true">&larr;</span> {{ isEditing ? 'Back to workout' : 'Back to Gym' }}
    </RouterLink>

    <div v-if="loadingExisting" class="workout-form-page__skeleton" aria-hidden="true">
      <SkeletonBlock height="2.2rem" width="45%" />
      <SkeletonBlock height="7rem" />
      <SkeletonBlock height="11rem" />
    </div>

    <EmptyState v-else-if="isEditing && !foundExisting" message="This workout doesn't exist, or isn't yours to edit.">
      <AppButton variant="primary" to="/gym">Back to Gym</AppButton>
    </EmptyState>

    <form v-else class="workout-form" @submit.prevent="handleSubmit">
      <h1 class="workout-form__title">{{ isEditing ? 'Edit workout' : 'New workout' }}</h1>

      <SectionCard title="Workout details">
        <div class="workout-form__details">
          <label class="form-field">
            <span class="form-label">Name</span>
            <input v-model="form.name" type="text" placeholder="e.g. Push Day" />
          </label>

          <div class="workout-form__dates">
            <label class="form-field">
              <span class="form-label">Started</span>
              <input v-model="form.startedAt" type="datetime-local" />
            </label>
            <label class="form-field">
              <span class="form-label">Ended</span>
              <input v-model="form.endedAt" type="datetime-local" />
            </label>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Exercises">
        <EmptyState v-if="form.exercises.length === 0" message="Add your first exercise to get started.">
          <AppButton variant="primary" size="sm" @click="addExercise">+ Add exercise</AppButton>
        </EmptyState>

        <div v-else class="workout-form__exercises">
          <ExerciseFormRow
            v-for="(exercise, index) in form.exercises"
            :key="exercise.id"
            :exercise="exercise"
            :started-at="exerciseTimings[index].startedAt"
            @remove="removeExercise(exercise.id)"
          />

          <AppButton class="workout-form__add-exercise" size="sm" @click="addExercise">+ Add exercise</AppButton>
        </div>
      </SectionCard>

      <p v-if="errorMessage" class="workout-form__error" role="alert">{{ errorMessage }}</p>

      <div class="workout-form__actions">
        <AppButton :to="backLink">Cancel</AppButton>
        <AppButton variant="primary" size="lg" type="submit" :disabled="submitting">
          {{ submitting ? 'Saving…' : isEditing ? 'Save changes' : 'Create workout' }}
        </AppButton>
      </div>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import AppButton from '@/components/common/AppButton.vue';
import EmptyState from '@/components/common/EmptyState.vue';
import SectionCard from '@/components/common/SectionCard.vue';
import SkeletonBlock from '@/components/common/SkeletonBlock.vue';
import ExerciseFormRow from '@/components/gym/form/ExerciseFormRow.vue';
import { createExerciseFormState, createRepFormState, createSetFormState, type ExerciseFormState } from '@/components/gym/form/formState';
import useWorkouts from '@/composables/gym/useWorkout';
import { applyTimeToDate, fromDateTimeLocalValue, toDateTimeLocalValue, toTimeInputValue } from '@/lib/datetimeInput';
import type { MutateWorkout, Workout } from '@/types/gym';

const props = defineProps<{
  id?: string;
}>();

const router = useRouter();
const isEditing = computed(() => !!props.id);
const backLink = computed(() => (isEditing.value ? `/gym/workouts/${props.id}` : '/gym'));

const { fetchWorkout, createWorkout, updateWorkout } = useWorkouts();
const loadingExisting = ref(isEditing.value);
const foundExisting = ref(!isEditing.value);
const submitting = ref(false);
const errorMessage = ref<string | null>(null);

const defaultStart = () => {
  const now = new Date();
  now.setMinutes(Math.round(now.getMinutes() / 5) * 5, 0, 0);
  return now;
};

const defaultEnd = (start: Date) => new Date(start.getTime() + 45 * 60 * 1000);

const form = reactive({
  name: '',
  startedAt: toDateTimeLocalValue(defaultStart()),
  endedAt: toDateTimeLocalValue(defaultEnd(defaultStart())),
  exercises: [createExerciseFormState()] as ExerciseFormState[],
});

const applyWorkoutToForm = (workout: Workout) => {
  form.name = workout.name;
  form.startedAt = toDateTimeLocalValue(workout.startedAt);
  form.endedAt = toDateTimeLocalValue(workout.endedAt);
  // A stored start that sits exactly where the chain would put it anyway
  // loads as "following" (startTime null) so it keeps tracking edits to the
  // workout start / earlier exercises; only a start that deviates from the
  // chain gets pinned to its own wall-clock time.
  let cursor = workout.startedAt;
  form.exercises = workout.exercises.map((exercise) => {
    const durationMinutes = Math.max(
      1,
      Math.round((exercise.endedAt.getTime() - exercise.startedAt.getTime()) / 60000),
    );
    const state = createExerciseFormState(exercise.name, durationMinutes);
    const onChain = toDateTimeLocalValue(exercise.startedAt) === toDateTimeLocalValue(cursor);
    state.startTime = onChain ? null : toTimeInputValue(exercise.startedAt);
    cursor = new Date(exercise.startedAt.getTime() + durationMinutes * 60000);
    state.sets = exercise.sets.map((set) =>
      createSetFormState(set.reps.map((rep) => createRepFormState(rep.weight, rep.amount))),
    );
    if (state.sets.length === 0) state.sets = [createSetFormState()];
    return state;
  });
};

// An exercise without a pinned start (startTime === null) starts the
// instant the previous one ends - and the very first one when the workout
// itself does - so it keeps *following* that anchor when the workout start
// or an earlier duration changes. Once the user types a start themselves
// it's pinned to that wall-clock time (resolved against the workout's own
// day) and stops following; everything after it chains off its end again.
const resolveExerciseStart = (workoutStart: Date, cursor: Date, startTime: string | null): Date =>
  startTime === null ? cursor : applyTimeToDate(workoutStart, startTime);

const exerciseTimings = computed(() => {
  const workoutStart = fromDateTimeLocalValue(form.startedAt);
  let cursor = workoutStart;
  return form.exercises.map((exercise) => {
    const startedAt = resolveExerciseStart(workoutStart, cursor, exercise.startTime);
    const endedAt = new Date(startedAt.getTime() + exercise.durationMinutes * 60000);
    cursor = endedAt;
    return { startedAt, endedAt };
  });
});

onMounted(async () => {
  if (!props.id) return;
  await fetchWorkout.execute(props.id);
  const workout = fetchWorkout.data.value;
  loadingExisting.value = false;
  if (!workout) {
    foundExisting.value = false;
    return;
  }
  foundExisting.value = true;
  applyWorkoutToForm(workout);
});

const addExercise = () => {
  form.exercises.push(createExerciseFormState());
};

const removeExercise = (id: string) => {
  form.exercises = form.exercises.filter((exercise) => exercise.id !== id);
};

const buildPayload = (): MutateWorkout | null => {
  const name = form.name.trim();
  if (!name) {
    errorMessage.value = 'Give the workout a name.';
    return null;
  }

  const startedAt = fromDateTimeLocalValue(form.startedAt);
  const endedAt = fromDateTimeLocalValue(form.endedAt);
  if (!(endedAt > startedAt)) {
    errorMessage.value = 'End time must be after the start time.';
    return null;
  }

  // A set only counts once it has at least one complete (weight + reps)
  // drop step; incomplete rows within an otherwise-valid set (e.g. a
  // half-filled "+ Add drop" row) are just dropped rather than blocking
  // the whole submission.
  const validExercises = form.exercises
    .map((exercise) => ({
      name: exercise.name.trim(),
      durationMinutes: exercise.durationMinutes,
      startTime: exercise.startTime,
      sets: exercise.sets
        .map((set) => ({
          reps: set.reps.filter(
            (rep) => rep.weight !== null && rep.amount !== null && rep.weight >= 0 && rep.amount >= 1,
          ),
        }))
        .filter((set) => set.reps.length > 0),
    }))
    .filter((exercise) => exercise.name && exercise.sets.length > 0);

  if (validExercises.length === 0) {
    errorMessage.value = 'Add at least one exercise with at least one completed set.';
    return null;
  }

  // Re-chain over just the exercises that survived filtering, in order -
  // dropped exercises (empty name/sets) don't eat into the timeline. Pinned
  // starts resolve the same way as in exerciseTimings.
  let cursor = startedAt;
  const exercises = validExercises.map((exercise) => {
    const exerciseStart = resolveExerciseStart(startedAt, cursor, exercise.startTime);
    const exerciseEnd = new Date(exerciseStart.getTime() + exercise.durationMinutes * 60000);
    cursor = exerciseEnd;
    return {
      name: exercise.name,
      startedAt: exerciseStart,
      endedAt: exerciseEnd,
      sets: exercise.sets.map((set) => ({
        reps: set.reps.map((rep) => ({ weight: rep.weight!, amount: rep.amount! })),
      })),
    };
  });

  return { name, startedAt, endedAt, exercises };
};

const handleSubmit = async () => {
  errorMessage.value = null;
  const payload = buildPayload();
  if (!payload) return;

  submitting.value = true;
  try {
    const saved = isEditing.value ? await updateWorkout.execute(props.id!, payload) : await createWorkout.execute(payload);
    router.push(`/gym/workouts/${saved.id}`);
  } catch {
    errorMessage.value = "Couldn't save this workout. Try again.";
  } finally {
    submitting.value = false;
  }
};
</script>

<style scoped>
.workout-form-page {
  max-width: 720px;
  margin: 0 auto;
  padding: 1.5rem 1.5rem 3rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.workout-form-page__back {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  align-self: flex-start;
  font-size: 0.87rem;
  font-weight: 600;
  color: var(--color-text);
  opacity: 0.75;
  text-decoration: none;
}

.workout-form-page__back:hover {
  opacity: 1;
  color: var(--color-primary);
  text-decoration: none;
}

.workout-form-page__skeleton {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.workout-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.workout-form__title {
  margin: 0;
  font-size: 1.6rem;
}

.workout-form__details {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.workout-form__dates {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.workout-form__exercises {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.workout-form__add-exercise {
  align-self: flex-start;
}

.workout-form__error {
  margin: 0;
  padding: 0.75rem 1rem;
  border-radius: var(--radius-md);
  background: rgba(var(--color-danger-rgb), 0.1);
  color: var(--color-danger);
  font-size: 0.87rem;
  font-weight: 600;
}

.workout-form__actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

@media (max-width: 480px) {
  .workout-form__dates {
    grid-template-columns: 1fr;
  }

  .workout-form__actions {
    flex-direction: column-reverse;
  }

  .workout-form__actions :deep(.app-button) {
    width: 100%;
  }
}
</style>
