<template>
  <div class="set-row">
    <span class="set-row__index">{{ index + 1 }}</span>

    <div class="set-row__reps">
      <div v-for="(rep, repIndex) in set.reps" :key="rep.id" class="set-row__rep">
        <label class="set-row__field">
          <span class="set-row__label">kg</span>
          <input
            type="number"
            inputmode="decimal"
            min="0"
            step="0.5"
            placeholder="0"
            :value="rep.weight ?? ''"
            @input="rep.weight = parseValue(($event.target as HTMLInputElement).value)"
          />
        </label>

        <label class="set-row__field">
          <span class="set-row__label">reps</span>
          <input
            type="number"
            inputmode="numeric"
            min="1"
            step="1"
            placeholder="0"
            :value="rep.amount ?? ''"
            @input="rep.amount = parseValue(($event.target as HTMLInputElement).value)"
          />
        </label>

        <!-- Only shown once there's more than one drop step - a lone rep
             has nothing to drop down from, so there's nothing to remove. -->
        <button
          v-if="set.reps.length > 1"
          type="button"
          class="set-row__remove-rep"
          aria-label="Remove drop"
          @click="removeRep(repIndex)"
        >
          <span aria-hidden="true">&times;</span>
        </button>
      </div>

      <button type="button" class="set-row__add-drop" @click="addRep">+ Add drop</button>
    </div>

    <button type="button" class="set-row__remove" aria-label="Remove set" @click="emit('remove')">
      <span aria-hidden="true">&times;</span>
    </button>
  </div>
</template>

<script lang="ts" setup>
import { createRepFormState, type SetFormState } from './formState';

const props = defineProps<{
  index: number;
  set: SetFormState;
}>();

const emit = defineEmits<{
  remove: [];
}>();

const parseValue = (raw: string): number | null => {
  if (raw === '') return null;
  const parsed = Number(raw);
  return Number.isNaN(parsed) ? null : parsed;
};

const addRep = () => {
  props.set.reps.push(createRepFormState());
};

const removeRep = (repIndex: number) => {
  props.set.reps.splice(repIndex, 1);
};
</script>

<style scoped>
.set-row {
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;
}

.set-row__index {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 1.8rem;
  height: 1.8rem;
  margin-top: 0.3rem;
  border-radius: 50%;
  background: rgba(var(--color-primary-rgb), 0.12);
  color: var(--color-primary);
  font-size: 0.75rem;
  font-weight: 700;
}

.set-row__reps {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.set-row__rep {
  display: flex;
  align-items: flex-end;
  gap: 0.6rem;
}

.set-row__field {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
  min-width: 0;
}

.set-row__field input {
  width: 100%;
}

.set-row__label {
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--color-text);
  opacity: 0.6;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.set-row__add-drop {
  align-self: flex-start;
  padding: 0.3rem 0;
  border: none;
  background: none;
  color: var(--color-primary);
  font-size: 0.78rem;
  font-weight: 700;
  cursor: pointer;
}

.set-row__add-drop:hover {
  text-decoration: underline;
}

.set-row__remove-rep,
.set-row__remove {
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

.set-row__remove-rep:hover,
.set-row__remove:hover {
  background: rgba(var(--color-danger-rgb), 0.12);
  color: var(--color-danger);
}

@media (prefers-reduced-motion: reduce) {
  .set-row__remove-rep,
  .set-row__remove {
    transition: none;
  }
}
</style>
