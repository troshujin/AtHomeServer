<template>
  <div class="exercise-form-row">
    <div class="exercise-form-row__header">
      <div class="exercise-form-row__field">
        <label class="form-label" :for="`exercise-name-${exercise.id}`">Exercise</label>
        <ComboBox
          :id="`exercise-name-${exercise.id}`"
          v-model="name"
          :options="knownExerciseNames"
          placeholder="e.g. Bench Press"
        />
      </div>

      <button type="button" class="exercise-form-row__remove" aria-label="Remove exercise" @click="emit('remove')">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>

    <div class="exercise-form-row__timing">
      <label class="form-field exercise-form-row__time-field">
        <span class="form-label">Start</span>
        <input type="time" :value="toTimeInputValue(startedAt)" @change="handleStartInput" />
      </label>

      <label class="form-field exercise-form-row__time-field">
        <span class="form-label">Minutes</span>
        <input
          type="number"
          inputmode="numeric"
          min="1"
          step="1"
          :value="exercise.durationMinutes"
          @input="handleDurationInput"
        />
      </label>

      <label class="form-field exercise-form-row__time-field">
        <span class="form-label">Ends</span>
        <input type="time" :value="toTimeInputValue(endedAt)" @change="handleEndInput" />
      </label>
    </div>

    <!--
      Helpful, not invasive: this is a suggestion the user has to actively
      take (a labeled button), never an automatic overwrite of whatever
      they've already typed. Someone else's numbers are never suggested
      here either - see exerciseHistory.ts, this only ever looks at the
      current user's own past sets for this exact exercise name.
    -->
    <div v-if="previousInstance" class="exercise-form-row__hint">
      <span class="exercise-form-row__hint-icon" aria-hidden="true">💡</span>
      <span class="exercise-form-row__hint-text">
        Last time ({{ formatDateShort(previousInstance.lastPerformedAt) }}): {{ previousSummary }}
      </span>
      <button type="button" class="exercise-form-row__hint-action" @click="applyPreviousSets">
        Use these sets
      </button>
    </div>

    <div class="exercise-form-row__sets">
      <SetInputRow
        v-for="(set, index) in exercise.sets"
        :key="set.id"
        :index="index"
        :set="set"
        @remove="removeSet(index)"
      />

      <AppButton class="exercise-form-row__add-set" size="sm" @click="addSet">+ Add set</AppButton>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import AppButton from '@/components/common/AppButton.vue';
import ComboBox from '@/components/common/ComboBox.vue';
import { findExerciseHistory, getKnownExerciseNames } from '@/composables/gym/exerciseHistory';
import { applyTimeToDate, toTimeInputValue } from '@/lib/datetimeInput';
import { formatDateShort } from '@/lib/formatters';
import { createRepFormState, createSetFormState, type ExerciseFormState } from './formState';
import SetInputRow from './SetInputRow.vue';

const props = defineProps<{
  exercise: ExerciseFormState;
  // Resolved by the parent form: the chained hint (previous exercise's end,
  // or the workout start) unless this exercise has pinned its own startTime.
  startedAt: Date;
}>();

const emit = defineEmits<{
  remove: [];
}>();

const endedAt = computed(() => new Date(props.startedAt.getTime() + props.exercise.durationMinutes * 60000));

// Typing a start pins it (it stops following the chain); clearing the
// field hands it back to the chain.
const handleStartInput = (event: Event) => {
  const raw = (event.target as HTMLInputElement).value;
  props.exercise.startTime = raw || null;
};

const handleDurationInput = (event: Event) => {
  const raw = Number((event.target as HTMLInputElement).value);
  if (Number.isFinite(raw) && raw > 0) {
    props.exercise.durationMinutes = Math.round(raw);
  }
};

// Editing the end time is really just a friendlier way to edit the
// duration - it works backwards from the (fixed) start time so the second
// field always stays in sync, clamped above zero minutes.
const handleEndInput = (event: Event) => {
  const raw = (event.target as HTMLInputElement).value;
  if (!raw) return;
  const newEnd = applyTimeToDate(props.startedAt, raw);
  const diffMinutes = Math.round((newEnd.getTime() - props.startedAt.getTime()) / 60000);
  props.exercise.durationMinutes = Math.max(1, diffMinutes);
};

// Computed, not a snapshot: the history reads the real `/workouts` list
// out of the shared cache, and this row can be mounted before that fetch
// (kicked off by the form view) has resolved - a snapshot would freeze the
// suggestions as empty.
const knownExerciseNames = computed(() => getKnownExerciseNames());

const name = computed({
  get: () => props.exercise.name,
  set: (value: string) => {
    props.exercise.name = value;
  },
});

const previousInstance = computed(() => {
  if (!props.exercise.name.trim()) return null;
  return findExerciseHistory(props.exercise.name) ?? null;
});

// Every historical set, with every one of its reps (drop-set steps
// included) - the form models the same "a set is a list of weight+reps
// pairs" shape as the real data now, so there's no need to flatten or
// pick just the heaviest rep the way an earlier version of this had to.
const previousSets = computed(() => previousInstance.value?.exercise.sets ?? []);

const previousSummary = computed(() => {
  const sets = previousSets.value;
  if (sets.length === 0) return '';
  const heaviest = Math.max(...sets.flatMap((set) => set.reps.map((rep) => rep.weight)));
  return `${sets.length} sets, up to ${heaviest}kg`;
});

const applyPreviousSets = () => {
  const sets = previousSets.value;
  if (sets.length === 0) return;
  props.exercise.sets = sets.map((set) =>
    createSetFormState(set.reps.map((rep) => createRepFormState(rep.weight, rep.amount))),
  );
};

const addSet = () => {
  props.exercise.sets.push(createSetFormState());
};

const removeSet = (index: number) => {
  props.exercise.sets.splice(index, 1);
};
</script>

<style scoped>
.exercise-form-row {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  padding: 1rem;
  background: var(--color-surface-alt);
  border-radius: var(--radius-md);
}

.exercise-form-row__header {
  display: flex;
  align-items: flex-end;
  gap: 0.6rem;
}

.exercise-form-row__field {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.exercise-form-row__remove {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 2.4rem;
  height: 2.4rem;
  border: none;
  border-radius: var(--radius-md);
  background: rgba(var(--overlay-rgb), 0.06);
  color: var(--color-text);
  font-size: 1.1rem;
  cursor: pointer;
  transition: background-color 0.15s ease, color 0.15s ease;
}

.exercise-form-row__remove:hover {
  background: rgba(var(--color-danger-rgb), 0.12);
  color: var(--color-danger);
}

.exercise-form-row__timing {
  display: flex;
  gap: 0.6rem;
}

.exercise-form-row__time-field {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.exercise-form-row__hint {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 0.6rem 0.75rem;
  background: rgba(var(--color-primary-rgb), 0.08);
  border-radius: var(--radius-md);
  font-size: 0.82rem;
  color: var(--color-secondary);
}

.exercise-form-row__hint-icon {
  flex-shrink: 0;
}

.exercise-form-row__hint-text {
  flex: 1;
  min-width: 0;
}

.exercise-form-row__hint-action {
  flex-shrink: 0;
  padding: 0.3rem 0.7rem;
  border: none;
  border-radius: var(--radius-pill);
  background: var(--color-primary);
  color: #fff;
  font-size: 0.78rem;
  font-weight: 700;
  cursor: pointer;
}

.exercise-form-row__sets {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  /* Sets rows are default-stretched to fill the width for consistent input
     sizing; only the "add set" button opts out to stay compact. */
}

.exercise-form-row__add-set {
  align-self: flex-start;
}

@media (prefers-reduced-motion: reduce) {
  .exercise-form-row__remove {
    transition: none;
  }
}

@media (max-width: 420px) {
  /* The native time picker's clock icon leaves too little room for "Ends"
     in an even three-way split at this width - give it its own row instead. */
  .exercise-form-row__timing {
    flex-wrap: wrap;
  }

  .exercise-form-row__timing .exercise-form-row__time-field:last-child {
    flex-basis: 100%;
  }
}
</style>
