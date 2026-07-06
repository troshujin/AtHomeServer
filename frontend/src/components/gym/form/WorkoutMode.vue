<template>
  <!-- Teleported: .workout-form-page has no transformed/filtered ancestor
       today, but every full-screen fixed overlay in this app lives on <body>
       (see NavBar's mobile menu in the style guide) so none of them can be
       silently captured by a future backdrop-filter. -->
  <Teleport to="body">
    <div class="workout-mode" role="dialog" aria-modal="true" aria-label="Workout mode">
      <header class="workout-mode__top">
        <span class="workout-mode__title">{{ form.name || 'Workout' }}</span>
        <button type="button" class="workout-mode__exit" @click="emit('exit')">Normal view</button>
      </header>

      <!-- ============ Naming: what are you about to lift? ============ -->
      <form v-if="stage === 'naming'" class="workout-mode__stage workout-mode__naming" @submit.prevent="submitName">
        <div class="form-field">
          <label class="form-label" for="workout-mode-exercise">Exercise</label>
          <ComboBox
            id="workout-mode-exercise"
            ref="nameCombo"
            v-model="exerciseName"
            class="workout-mode__name-combo"
            :options="knownExerciseNames"
            placeholder="e.g. Bench Press"
          />
        </div>

        <div class="workout-mode__stage-actions">
          <AppButton variant="primary" size="lg" block type="submit" :disabled="!exerciseName.trim()">
            Start exercise
          </AppButton>
          <AppButton v-if="canCancelNaming" block @click="cancelNaming">Back</AppButton>
        </div>
      </form>

      <!-- ============ Overview: sets so far, what next? ============ -->
      <div v-else-if="stage === 'overview' && exercise" class="workout-mode__stage workout-mode__overview">
        <div class="workout-mode__heading">
          <h2 class="workout-mode__exercise-name">{{ exercise.name }}</h2>
          <p class="workout-mode__hero">
            <strong>{{ formatWeight(exerciseVolume) }}</strong> kg lifted this exercise
          </p>
        </div>

        <EmptyState v-if="completedSets.length === 0" message="No sets yet — start your first one." />
        <!-- Same set rows as the workout detail page: index badge + RepChart.
             The chart scrolls horizontally inside itself; the list only
             scrolls if a marathon session outgrows the screen. -->
        <ol v-else class="workout-mode__sets">
          <li v-for="(set, index) in completedSets" :key="set.id" class="workout-mode__set-row">
            <span class="workout-mode__set-index">{{ index + 1 }}</span>
            <RepChart :reps="chartReps(set)" />
          </li>
        </ol>

        <div class="workout-mode__stage-actions">
          <AppButton variant="primary" size="lg" block @click="startSet">+ Start set</AppButton>
          <AppButton size="lg" block @click="nextExercise">Next exercise &rarr;</AppButton>
        </div>
      </div>

      <!-- ============ Set: the actual lifting ============ -->
      <div v-else-if="stage === 'set' && exercise" class="workout-mode__stage workout-mode__set">
        <div class="workout-mode__heading">
          <h2 class="workout-mode__exercise-name">{{ exercise.name }}</h2>
          <p class="workout-mode__set-label">Set {{ completedSets.length + 1 }}</p>
        </div>

        <!-- The live version of the detail page's rep chart; ⌫ removes the
             most recent rep. -->
        <div class="workout-mode__bars" aria-live="polite">
          <RepChart v-if="bars.length" :reps="bars" />
          <span v-else class="workout-mode__bars-empty">No reps yet</span>
          <button
            type="button"
            class="workout-mode__undo"
            aria-label="Remove last rep"
            :disabled="!bars.length"
            @click="undoRep"
          >
            &#9003;
          </button>
        </div>

        <div class="workout-mode__weight">
          <div class="workout-mode__weight-box">
            <span class="workout-mode__weight-line">
              <input
                v-model.number="weight"
                type="number"
                inputmode="decimal"
                min="0"
                step="0.5"
                aria-label="Weight in kilograms"
                :style="{ width: weightInputWidth }"
              />
              <span class="workout-mode__weight-unit">kg</span>
            </span>
          </div>
          <div class="workout-mode__steppers">
            <button type="button" class="workout-mode__step" @click="bumpWeight(0.5)">+0.5</button>
            <button type="button" class="workout-mode__step" @click="bumpWeight(2)">+2.0</button>
            <button type="button" class="workout-mode__step" @click="bumpWeight(-0.5)">&minus;0.5</button>
            <button type="button" class="workout-mode__step" @click="bumpWeight(-2)">&minus;2.0</button>
          </div>
        </div>

        <div class="workout-mode__counter">
          <p class="workout-mode__count" aria-live="polite">
            <strong>{{ currentGroupCount }}</strong>
            <span>reps at {{ formatWeight(normalizedWeight) }} kg</span>
          </p>
          <button type="button" class="workout-mode__add-rep" @click="addRep">+1 rep</button>
        </div>

        <div class="workout-mode__stage-actions">
          <AppButton variant="primary" size="lg" block @click="endSet">End set</AppButton>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script lang="ts" setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import AppButton from '@/components/common/AppButton.vue';
import ComboBox from '@/components/common/ComboBox.vue';
import EmptyState from '@/components/common/EmptyState.vue';
import RepChart, { type RepChartRep } from '@/components/gym/detail/RepChart.vue';
import { findExerciseHistory, getKnownExerciseNames } from '@/composables/gym/exerciseHistory';
import { formatWeight } from '@/lib/formatters';
import {
  createExerciseFormState,
  createRepFormState,
  createSetFormState,
  isCompletedSet,
  type SetFormState,
  type WorkoutFormState,
} from './formState';

/**
 * Full-screen, one-thumb workout logger (mobile). It edits the SAME reactive
 * form state as the normal form - every rep logged here is immediately
 * visible (and fixable) in the normal view, which is the escape hatch for
 * mistakes. Always operates on the LAST exercise in the list; "Next
 * exercise" appends a new one.
 *
 * A "bar" below = one weight×reps group within a set (the drop-set shape
 * the data model already has): +1 rep increments the current group while
 * the weight matches, or starts a new group when it changed.
 */
const props = defineProps<{
  form: WorkoutFormState;
}>();

const emit = defineEmits<{
  exit: [];
}>();

type Stage = 'naming' | 'overview' | 'set';

const stage = ref<Stage>('naming');
const exerciseName = ref('');
const nameCombo = ref<InstanceType<typeof ComboBox> | null>(null);
// True while "Next exercise" is being named - Back returns to the previous
// exercise's overview instead of stranding the user.
const namingNext = ref(false);

const bars = ref<RepChartRep[]>([]);
const weight = ref<number | ''>(20);

const exercise = computed(() => props.form.exercises.at(-1) ?? null);
const completedSets = computed(() => (exercise.value?.sets ?? []).filter(isCompletedSet));

// Computed, not a snapshot - the history reads the real `/workouts` list
// from the shared cache, which may resolve after this overlay opens.
const knownExerciseNames = computed(() => getKnownExerciseNames());

const chartReps = (set: SetFormState): RepChartRep[] =>
  set.reps
    .filter((rep) => rep.weight !== null && rep.amount !== null)
    .map((rep) => ({ id: rep.id, weight: rep.weight!, amount: rep.amount! }));

const exerciseVolume = computed(() =>
  completedSets.value.reduce(
    (sum, set) => sum + set.reps.reduce((s, rep) => s + (rep.weight ?? 0) * (rep.amount ?? 0), 0),
    0,
  ),
);

// ---- naming ----

const canCancelNaming = computed(() => namingNext.value && !!exercise.value?.name.trim());

const focusName = () => nextTick(() => nameCombo.value?.focus());

const submitName = () => {
  const name = exerciseName.value.trim();
  if (!name) return;

  const last = exercise.value;
  if (!namingNext.value && last && !last.name.trim()) {
    // The form's initial blank exercise: name it instead of appending.
    last.name = name;
  } else {
    props.form.exercises.push(createExerciseFormState(name));
  }

  namingNext.value = false;
  stage.value = 'overview';
};

const cancelNaming = () => {
  namingNext.value = false;
  stage.value = 'overview';
};

const nextExercise = () => {
  exerciseName.value = '';
  namingNext.value = true;
  stage.value = 'naming';
  focusName();
};

// ---- the active set ----

const normalizedWeight = computed(() => (typeof weight.value === 'number' && weight.value > 0 ? weight.value : 0));

// The number and its "kg" unit share one input box; the input itself is
// sized to its content so the unit sits right next to the digits.
const weightInputWidth = computed(() => `${Math.max(String(weight.value || 0).length, 1) + 1}ch`);

const currentGroupCount = computed(() => {
  const last = bars.value.at(-1);
  return last && last.weight === normalizedWeight.value ? last.amount : 0;
});

const defaultWeight = (): number => {
  // Continuity first (this session's last group), then "what did I lift
  // last time" from the user's own history, then an empty bar.
  const lastSet = completedSets.value.at(-1);
  const lastRep = lastSet?.reps.filter((rep) => rep.weight !== null).at(-1);
  if (lastRep?.weight != null) return lastRep.weight;

  const history = exercise.value ? findExerciseHistory(exercise.value.name) : undefined;
  const historicRep = history?.exercise.sets.at(-1)?.reps.at(-1);
  return historicRep?.weight ?? 20;
};

const startSet = () => {
  bars.value = [];
  weight.value = defaultWeight();
  stage.value = 'set';
};

const bumpWeight = (delta: number) => {
  // Snap to the 0.5 grid so +0.5 after a typed 61.3 gives 62.0, not 61.8.
  const next = Math.round((normalizedWeight.value + delta) * 2) / 2;
  weight.value = Math.max(0, next);
};

const addRep = () => {
  const w = normalizedWeight.value;
  if (w <= 0) return;

  const last = bars.value.at(-1);
  if (last && last.weight === w) {
    last.amount += 1;
  } else {
    bars.value.push({ weight: w, amount: 1 });
  }
};

const undoRep = () => {
  const last = bars.value.at(-1);
  if (!last) return;
  last.amount -= 1;
  if (last.amount <= 0) bars.value.pop();
};

const endSet = () => {
  if (exercise.value && bars.value.length > 0) {
    const set = createSetFormState(bars.value.map((bar) => createRepFormState(bar.weight, bar.amount)));

    // The form seeds every exercise with one blank set; take its place
    // rather than leaving an empty "Set 1" behind.
    const sets = exercise.value.sets;
    if (sets.length === 1 && !isCompletedSet(sets[0]!)) {
      exercise.value.sets = [set];
    } else {
      sets.push(set);
    }
  }
  bars.value = [];
  stage.value = 'overview';
};

// ---- lifecycle ----

onMounted(() => {
  // The page behind must not scroll while the overlay is up.
  document.body.style.overflow = 'hidden';

  if (!exercise.value || !exercise.value.name.trim()) {
    stage.value = 'naming';
    exerciseName.value = exercise.value?.name ?? '';
    focusName();
  } else {
    stage.value = 'overview';
  }
});

onUnmounted(() => {
  document.body.style.overflow = '';
});

watch(stage, (value) => {
  if (value === 'naming') focusName();
});
</script>

<style scoped>
.workout-mode {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  background: var(--color-background);
  padding: calc(0.75rem + env(safe-area-inset-top)) 1.25rem calc(1.25rem + env(safe-area-inset-bottom));
  /* The overlay itself never scrolls - each stage is laid out to fit, and
     the only scrolling surface is the rep chart's own horizontal scroller
     (plus the set list, if a session outgrows the screen). */
  overflow: hidden;
  overscroll-behavior: none;
}

.workout-mode__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-shrink: 0;
}

.workout-mode__title {
  font-weight: 700;
  color: var(--color-secondary);
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.workout-mode__exit {
  flex-shrink: 0;
  min-height: 2.5rem;
  padding: 0.4rem 1rem;
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-pill);
  background: var(--color-surface);
  color: var(--color-text);
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
}

.workout-mode__stage {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-height: 0;
}

/* Actions pinned to the bottom of whatever space the stage leaves. */
.workout-mode__stage-actions {
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding-top: 1rem;
  flex-shrink: 0;
}

.workout-mode__naming {
  padding-top: 1.5rem;
}

.workout-mode__name-combo :deep(.combobox__input) {
  font-size: 1.2rem;
  padding: 0.85rem 1rem;
}

.workout-mode__heading {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex-shrink: 0;
}

.workout-mode__exercise-name {
  margin: 0;
  font-size: 1.5rem;
}

.workout-mode__hero {
  margin: 0;
  color: var(--color-text);
  opacity: 0.75;
}

.workout-mode__hero strong {
  font-size: 1.3rem;
  color: var(--color-primary);
}

.workout-mode__set-label {
  margin: 0;
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--color-primary);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

/* Scrolls only when a long session outgrows the screen. */
.workout-mode__sets {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  list-style: none;
  margin: 0;
  padding: 0;
  min-height: 0;
  overflow-y: auto;
}

/* Mirrors the detail page's .exercise-set row. */
.workout-mode__set-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: var(--color-surface-alt);
  border-radius: var(--radius-md);
  flex-shrink: 0;
}

.workout-mode__set-index {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 1.8rem;
  height: 1.8rem;
  border-radius: 50%;
  background: rgba(var(--color-primary-rgb), 0.12);
  color: var(--color-primary);
  font-size: 0.75rem;
  font-weight: 700;
}

/* Fixed height whether empty or holding the chart: nothing on this screen
   may move when the first rep lands - the only motion in workout mode is
   the chart's own horizontal scrolling. */
.workout-mode__bars {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  height: 8.25rem;
  padding: 0.75rem;
  background: var(--color-surface-alt);
  border-radius: var(--radius-md);
  flex-shrink: 0;
}

@media (max-width: 480px) {
  .workout-mode__bars {
    height: 7.5rem;
  }
}

.workout-mode__bars-empty {
  flex: 1;
  color: var(--color-text);
  opacity: 0.55;
  font-size: 0.85rem;
}

.workout-mode__undo {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 2.75rem;
  height: 2.75rem;
  border: none;
  border-radius: var(--radius-md);
  background: rgba(var(--overlay-rgb), 0.08);
  color: var(--color-text);
  font-size: 1.2rem;
  cursor: pointer;
}

.workout-mode__undo:active {
  background: rgba(var(--color-danger-rgb), 0.15);
  color: var(--color-danger);
}

.workout-mode__undo:disabled {
  opacity: 0.35;
  cursor: default;
}

.workout-mode__weight {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 0.75rem;
  align-items: stretch;
  flex-shrink: 0;
}

/* Styled as one input; the real <input> inside is chrome-less and sized to
   its digits so the kg unit sits right next to the number, sharing its
   baseline. Height comes from stretching to match the 2x2 stepper grid. */
.workout-mode__weight-box {
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-surface);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.workout-mode__weight-box:focus-within {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(var(--color-primary-rgb), 0.15);
}

.workout-mode__weight-line {
  display: inline-flex;
  align-items: baseline;
  gap: 0.3ch;
}

.workout-mode__weight-line input {
  border: none;
  background: none;
  padding: 0;
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-secondary);
  text-align: right;
  font-variant-numeric: tabular-nums;
  appearance: textfield;
  -moz-appearance: textfield;
}

.workout-mode__weight-line input:focus {
  outline: none;
  border: none;
  box-shadow: none;
}

.workout-mode__weight-line input::-webkit-outer-spin-button,
.workout-mode__weight-line input::-webkit-inner-spin-button {
  appearance: none;
  margin: 0;
}

.workout-mode__weight-unit {
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-secondary);
  opacity: 0.55;
}

.workout-mode__steppers {
  display: grid;
  grid-template-columns: repeat(2, minmax(3.6rem, 1fr));
  grid-template-rows: repeat(2, 1fr);
  gap: 0.5rem;
}

.workout-mode__step {
  min-width: 3.6rem;
  min-height: 2.75rem;
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
  background: var(--color-surface);
  color: var(--color-secondary);
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
}

.workout-mode__step:active {
  background: rgba(var(--color-primary-rgb), 0.12);
  color: var(--color-primary);
}

.workout-mode__counter {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 0.75rem;
  padding-top: 0.25rem;
  flex-shrink: 0;
}

.workout-mode__count {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.1rem;
  margin: 0;
}

/* The one hero number on this screen (style guide §7). */
.workout-mode__count strong {
  font-size: 3rem;
  font-weight: 800;
  line-height: 1;
  color: var(--color-secondary);
  font-variant-numeric: tabular-nums;
}

.workout-mode__count span {
  font-size: 0.85rem;
  color: var(--color-text);
  opacity: 0.65;
}

/* The hero action: full-width rounded rectangle, same shape language as a
   `lg` AppButton but bigger - it's the button you hit mid-set with shaky
   arms, so it gets the largest target on the screen. */
.workout-mode__add-rep {
  width: 100%;
  min-height: 4.75rem;
  border: none;
  border-radius: var(--radius-lg);
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
  color: #fff;
  font-size: 1.5rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  cursor: pointer;
  box-shadow: 0 10px 30px -10px rgba(var(--color-primary-rgb), 0.55);
  transition: transform 0.15s ease;
  touch-action: manipulation;
  -webkit-user-select: none;
  user-select: none;
}

.workout-mode__add-rep:active {
  transform: scale(0.97);
}

@media (prefers-reduced-motion: reduce) {
  .workout-mode__add-rep,
  .workout-mode__weight-box {
    transition: none;
  }

  .workout-mode__add-rep:active {
    transform: none;
  }
}
</style>
