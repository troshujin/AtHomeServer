<template>
  <PageShell class="workout-form-page">
    <BackLink :to="backLink">{{ isEditing ? 'Back to workout' : 'Back to Gym' }}</BackLink>

    <div v-if="loadingExisting" class="workout-form-page__skeleton" aria-hidden="true">
      <SkeletonBlock height="2.2rem" width="45%" />
      <SkeletonBlock height="7rem" />
      <SkeletonBlock height="11rem" />
    </div>

    <EmptyState
      v-else-if="isEditing && !foundExisting"
      message="This workout doesn't exist, or isn't yours to edit."
    >
      <AppButton variant="primary" to="/gym">Back to Gym</AppButton>
    </EmptyState>

    <form v-else class="workout-form" @submit.prevent="handleSubmit">
      <div class="workout-form__title-row">
        <h1 class="workout-form__title">{{ isEditing ? 'Edit workout' : 'New workout' }}</h1>
        <span
          v-if="autosaveLabel"
          class="workout-form__autosave"
          :class="{ 'workout-form__autosave--error': autosaveState === 'error' }"
          role="status"
        >
          {{ autosaveLabel }}
        </span>
      </div>

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
              <span class="form-hint">Leave empty while you're still lifting.</span>
            </label>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Exercises">
        <EmptyState
          v-if="form.exercises.length === 0"
          message="Add your first exercise to get started."
        >
          <AppButton variant="primary" size="sm" @click="addExercise">+ Add exercise</AppButton>
        </EmptyState>

        <div v-else class="workout-form__exercises">
          <ExerciseFormRow
            v-for="(exercise, index) in form.exercises"
            :key="exercise.id"
            :exercise="exercise"
            :started-at="exerciseTimings[index]!.startedAt"
            @remove="removeExercise(exercise.id)"
          />

          <div class="workout-form__exercise-actions">
            <AppButton size="sm" @click="addExercise">+ Add exercise</AppButton>
            <AppButton v-if="isEditing && !form.endedAt" size="sm" @click="openEndWorkoutModal"
              >End workout</AppButton
            >
          </div>
        </div>
      </SectionCard>

      <p v-if="errorMessage" class="workout-form__error" role="alert">{{ errorMessage }}</p>

      <div class="workout-form__modes" role="group" aria-label="Editing mode">
        <button type="button" class="workout-form__mode is-active" aria-pressed="true">
          Full view
        </button>
        <button
          type="button"
          class="workout-form__mode"
          aria-pressed="false"
          @click="mode = 'workout'"
        >
          Workout mode
        </button>
      </div>

      <div class="workout-form__actions">
        <AppButton :disabled="deleteWorkout.loading.value" @click="showDeleteConfirm = true">
          Delete
        </AppButton>
        <div class="workout-form__actions-right">
          <AppButton :to="backLink">Cancel</AppButton>
          <AppButton variant="primary" size="lg" type="submit" :disabled="submitting">
            {{ submitting ? 'Saving…' : isEditing ? 'Save changes' : 'Create workout' }}
          </AppButton>
        </div>
      </div>
    </form>

    <WorkoutMode
      v-if="mode === 'workout'"
      :form="form"
      :ending="endingWorkout"
      @exit="mode = 'normal'"
      @end-workout="handleEndWorkoutNow"
    />

    <ConfirmDialog
      v-if="showDeleteConfirm"
      title="Delete this workout?"
      message="This can't be undone - the workout and all its exercises and sets will be gone for good."
      confirm-label="Delete"
      :loading="deleteWorkout.loading.value"
      @confirm="handleDelete"
      @close="showDeleteConfirm = false"
    />

    <Modal
      v-if="showEndWorkoutModal"
      title="End this workout?"
      :enable-closing="!endingWorkout"
      @close="showEndWorkoutModal = false"
    >
      <div class="end-workout">
        <label class="form-field">
          <span class="form-label">Ended</span>
          <input v-model="endWorkoutAt" type="datetime-local" />
        </label>
        <AppButton
          class="end-workout__now"
          size="sm"
          @click="endWorkoutAt = toDateTimeLocalValue(new Date())"
        >
          End now
        </AppButton>
        <p v-if="endWorkoutError" class="workout-form__error" role="alert">
          {{ endWorkoutError }}
        </p>
      </div>

      <template #footer>
        <AppButton :disabled="endingWorkout" @click="showEndWorkoutModal = false">
          Cancel
        </AppButton>
        <AppButton variant="primary" :disabled="endingWorkout" @click="confirmEndWorkout">
          {{ endingWorkout ? 'Ending…' : 'End workout' }}
        </AppButton>
      </template>
    </Modal>
  </PageShell>
</template>

<script lang="ts" setup>
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import AppButton from '@/components/common/AppButton.vue';
import BackLink from '@/components/common/BackLink.vue';
import ConfirmDialog from '@/components/common/ConfirmDialog.vue';
import EmptyState from '@/components/common/EmptyState.vue';
import Modal from '@/components/common/Modal.vue';
import PageShell from '@/components/common/PageShell.vue';
import SectionCard from '@/components/common/SectionCard.vue';
import SkeletonBlock from '@/components/common/SkeletonBlock.vue';
import ExerciseFormRow from '@/components/gym/form/ExerciseFormRow.vue';
import {
  createExerciseFormState,
  createRepFormState,
  createSetFormState,
  type ExerciseFormState,
  type WorkoutFormState,
} from '@/components/gym/form/formState';
import WorkoutMode from '@/components/gym/form/WorkoutMode.vue';
import useWorkouts, { HISTORY_PARAMS } from '@/composables/gym/useWorkout';
import {
  applyTimeToDate,
  fromDateTimeLocalValue,
  toDateTimeLocalValue,
  toTimeInputValue,
} from '@/lib/datetimeInput';
import type { MutateWorkout, MutateWorkoutExercise, Workout } from '@/types/gym';

const props = defineProps<{
  id?: string;
}>();

const router = useRouter();
const isEditing = computed(() => !!props.id);

const { fetchWorkouts, fetchWorkout, updateWorkout } = useWorkouts();
const { deleteWorkout } = useWorkouts();

const loadingExisting = ref(true);
const foundExisting = ref(false);
const submitting = ref(false);
const showDeleteConfirm = ref(false);
const errorMessage = ref<string | null>(null);

const showEndWorkoutModal = ref(false);
const endWorkoutAt = ref('');
const endWorkoutError = ref<string | null>(null);
const endingWorkout = ref(false);

const defaultStart = () => {
  const now = new Date();
  now.setMinutes(Math.round(now.getMinutes() / 5) * 5, 0, 0);
  return now;
};
const backLink = computed(() => (isEditing.value ? `/gym/workouts/${props.id}` : '/gym'));

const form = reactive<WorkoutFormState>({
  name: '',
  startedAt: toDateTimeLocalValue(defaultStart()),
  endedAt: '',
  exercises: [createExerciseFormState()] as ExerciseFormState[],
});

const mode = ref<'normal' | 'workout'>('normal');

const applyWorkoutToForm = (workout: Workout) => {
  form.name = workout.name;
  form.startedAt = toDateTimeLocalValue(workout.startedAt);
  form.endedAt = workout.endedAt ? toDateTimeLocalValue(workout.endedAt) : '';

  let cursor = workout.startedAt;
  form.exercises = workout.exercises.map((exercise) => {
    const durationMinutes = exercise.endedAt
      ? Math.max(1, Math.round((exercise.endedAt.getTime() - exercise.startedAt.getTime()) / 60000))
      : 10;
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
  fetchWorkouts.execute(HISTORY_PARAMS);

  if (!props.id) {
    loadingExisting.value = false;
    foundExisting.value = false;
    return;
  }

  await fetchWorkout.execute(props.id);
  const workout = fetchWorkout.data.value;
  loadingExisting.value = false;
  if (!workout) {
    foundExisting.value = false;
    return;
  }
  foundExisting.value = true;
  applyWorkoutToForm(workout);
  enableAutosave();
});

const addExercise = () => {
  form.exercises.push(createExerciseFormState());
};

const removeExercise = (id: string) => {
  form.exercises = form.exercises.filter((exercise) => exercise.id !== id);
};

const handleDelete = async () => {
  if (!props.id) return;
  try {
    await deleteWorkout.execute(props.id);
    router.push({ name: 'gym-workouts' });
  } catch {
  } finally {
    showDeleteConfirm.value = false;
  }
};

const openEndWorkoutModal = () => {
  endWorkoutError.value = null;
  endWorkoutAt.value = toDateTimeLocalValue(new Date());
  showEndWorkoutModal.value = true;
};

// Sets the workout's end time, then runs it through the same strict,
// validated save path as the explicit Save button - so it either lands on
// the workout view page (the save's own success navigation) or surfaces the
// usual validation error, which we mirror into the modal since the error
// banner underneath the form is hidden behind it.
const confirmEndWorkout = async () => {
  endWorkoutError.value = null;
  if (!endWorkoutAt.value) {
    endWorkoutError.value = 'Pick an end time.';
    return;
  }

  endingWorkout.value = true;
  form.endedAt = endWorkoutAt.value;
  try {
    await handleSubmit();
    if (errorMessage.value) {
      endWorkoutError.value = errorMessage.value;
    } else {
      showEndWorkoutModal.value = false;
    }
  } finally {
    endingWorkout.value = false;
  }
};

// WorkoutMode's one-tap "End workout" - no time to pick a date mid-set, so
// it ends now and saves straight through, same as the modal's "End now" +
// confirm in one step. Its button only ever shows once the form already
// has a valid payload, so a failure here means the save itself (e.g.
// network) failed, not validation - drop back to the normal view so the
// error banner (hidden behind the full-screen overlay) is visible.
const handleEndWorkoutNow = async () => {
  endingWorkout.value = true;
  form.endedAt = toDateTimeLocalValue(new Date());
  try {
    await handleSubmit();
    if (errorMessage.value) {
      mode.value = 'normal';
    }
  } finally {
    endingWorkout.value = false;
  }
};

const collectExercises = (startedAt: Date): MutateWorkoutExercise[] => {
  const validExercises = form.exercises
    .map((exercise) => ({
      name: exercise.name.trim(),
      durationMinutes: exercise.durationMinutes,
      startTime: exercise.startTime,
      sets: exercise.sets
        .map((set) => ({
          reps: set.reps.filter(
            (rep) =>
              rep.weight !== null && rep.amount !== null && rep.weight >= 0 && rep.amount >= 1,
          ),
        }))
        .filter((set) => set.reps.length > 0),
    }))
    .filter((exercise) => exercise.name && exercise.sets.length > 0);

  let cursor = startedAt;
  return validExercises.map((exercise) => {
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
};

const buildPayload = (): MutateWorkout | null => {
  const name = form.name.trim();
  if (!name) {
    errorMessage.value = 'Give the workout a name.';
    return null;
  }

  const startedAt = fromDateTimeLocalValue(form.startedAt);
  // An empty Ended field means the workout is still in progress.
  const endedAt = form.endedAt ? fromDateTimeLocalValue(form.endedAt) : null;
  if (endedAt && !(endedAt > startedAt)) {
    errorMessage.value = 'End time must be after the start time.';
    return null;
  }

  const exercises = collectExercises(startedAt);
  if (exercises.length === 0) {
    errorMessage.value = 'Add at least one exercise with at least one completed set.';
    return null;
  }

  return { name, startedAt, endedAt, exercises };
};

const buildDraftPayload = (): MutateWorkout => {
  const startedAt = fromDateTimeLocalValue(form.startedAt);
  const endedAt = form.endedAt ? fromDateTimeLocalValue(form.endedAt) : null;

  return {
    name: form.name.trim() || 'New workout',
    startedAt,
    endedAt: endedAt && endedAt > startedAt ? endedAt : null,
    exercises: collectExercises(startedAt),
  };
};

// ---- autosave ----

const AUTOSAVE_DEBOUNCE_MS = 2500;
const autosaveState = ref<'idle' | 'pending' | 'saving' | 'saved' | 'error'>('idle');
let autosaveTimer: ReturnType<typeof setTimeout> | null = null;
let autosaveEnabled = false;

const enableAutosave = () => {
  void nextTick(() => {
    autosaveEnabled = true;
  });
};

const runAutosave = async () => {
  autosaveTimer = null;
  if (!props.id || submitting.value) return;
  autosaveState.value = 'saving';
  try {
    await updateWorkout.execute(props.id, buildDraftPayload());
    autosaveState.value = autosaveTimer ? 'pending' : 'saved';
  } catch {
    autosaveState.value = 'error';
  }
};

watch(
  form,
  () => {
    if (!autosaveEnabled) return;
    autosaveState.value = 'pending';
    if (autosaveTimer) clearTimeout(autosaveTimer);
    autosaveTimer = setTimeout(() => void runAutosave(), AUTOSAVE_DEBOUNCE_MS);
  },
  { deep: true },
);

onBeforeUnmount(() => {
  if (autosaveTimer) {
    clearTimeout(autosaveTimer);
    void runAutosave();
  }
});

const autosaveLabel = computed(() => {
  switch (autosaveState.value) {
    case 'pending':
      return 'Unsaved changes…';
    case 'saving':
      return 'Saving…';
    case 'saved':
      return 'Saved';
    case 'error':
      return "Couldn't autosave — retrying on next change";
    default:
      return '';
  }
});

const handleSubmit = async () => {
  errorMessage.value = null;
  const payload = buildPayload();
  if (!payload || !props.id) return;

  if (autosaveTimer) {
    clearTimeout(autosaveTimer);
    autosaveTimer = null;
  }

  submitting.value = true;
  try {
    const saved = await updateWorkout.execute(props.id, payload);
    autosaveState.value = 'saved';
    router.push(`/gym/workouts/${saved.id}`);
  } catch {
    errorMessage.value = "Couldn't save this workout. Try again.";
  } finally {
    submitting.value = false;
  }
};
</script>

<style scoped>
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

.workout-form__title-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
}

.workout-form__title {
  margin: 0;
  font-size: 1.6rem;
}

.workout-form__autosave {
  flex-shrink: 0;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--color-text);
  opacity: 0.6;
}

.workout-form__autosave--error {
  color: var(--color-danger);
  opacity: 1;
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

.workout-form__exercise-actions {
  display: flex;
  flex-wrap: wrap;
  align-self: flex-start;
  gap: 0.75rem;
}

.end-workout {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.end-workout__now {
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
  justify-content: space-between;
  gap: 0.75rem;
}

.workout-form__actions-right {
  display: flex;
  gap: 0.75rem;
}

.workout-form__modes {
  display: none;
}

@media (max-width: 640px) {
  .workout-form__modes {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.6rem;
    margin-top: 0.75rem;
  }

  .workout-form__mode {
    min-height: 3.4rem;
    border: 1px solid var(--surface-border);
    border-radius: var(--radius-md);
    background: var(--color-surface);
    color: var(--color-text);
    font-size: 1rem;
    font-weight: 700;
    cursor: pointer;
  }

  .workout-form__mode.is-active {
    border-color: var(--color-primary);
    background: rgba(var(--color-primary-rgb), 0.1);
    color: var(--color-primary);
  }
}

@media (max-width: 480px) {
  .workout-form__dates {
    grid-template-columns: 1fr;
  }

  .workout-form__actions {
    flex-direction: column-reverse;
    align-items: stretch;
  }

  .workout-form__actions-right {
    flex-direction: column-reverse;
  }

  .workout-form__actions :deep(.app-button) {
    width: 100%;
  }
}
</style>
