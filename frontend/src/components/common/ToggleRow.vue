<template>
  <button
    type="button"
    class="toggle-row"
    :class="{ 'is-on': modelValue }"
    :aria-pressed="modelValue"
    :disabled="disabled"
    @click="$emit('update:modelValue', !modelValue)"
  >
    <span v-if="icon" class="toggle-row__icon" aria-hidden="true">
      <Icon :icon="icon" />
    </span>

    <span class="toggle-row__body">
      <span class="toggle-row__label">{{ label }}</span>
      <span v-if="description" class="toggle-row__description">{{ description }}</span>
    </span>

    <span class="toggle-row__switch" aria-hidden="true">
      <span class="toggle-row__knob" />
    </span>
  </button>
</template>

<script lang="ts" setup>
import Icon from '@/components/common/Icon.vue';
import type { IconName } from '@/lib/icons';

/**
 * A labeled on/off setting row with a switch affordance - one full-width
 * tap target (label, description, and switch all toggle it), `aria-pressed`
 * carrying the state. `disabled` is for "save in flight", per AppButton's
 * disabled convention.
 */
defineProps<{
  modelValue: boolean;
  label: string;
  description?: string;
  icon?: IconName;
  disabled?: boolean;
}>();

defineEmits<{
  'update:modelValue': [value: boolean];
}>();
</script>

<style scoped>
.toggle-row {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  width: 100%;
  min-height: 3.5rem;
  padding: 0.75rem 0.85rem;
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
  background: var(--color-surface-alt);
  font-family: inherit;
  text-align: left;
  cursor: pointer;
  transition:
    background-color 0.15s ease,
    border-color 0.15s ease;
}

.toggle-row:hover {
  background: rgba(var(--overlay-rgb), 0.06);
}

.toggle-row:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.toggle-row__icon {
  flex-shrink: 0;
  display: flex;
  color: var(--color-text);
  font-size: 1.1rem;
}

.toggle-row__body {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  min-width: 0;
  flex: 1;
}

.toggle-row__label {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--color-secondary);
}

.toggle-row__description {
  font-size: 0.75rem;
  color: var(--color-text);
  opacity: 0.65;
}

.toggle-row__switch {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  width: 2.5rem;
  height: 1.5rem;
  padding: 0.15rem;
  border-radius: var(--radius-pill);
  background: rgba(var(--overlay-rgb), 0.15);
  transition: background-color 0.15s ease;
}

.toggle-row.is-on .toggle-row__switch {
  background: var(--color-primary);
}

.toggle-row__knob {
  width: 1.2rem;
  height: 1.2rem;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.25);
  transition: transform 0.15s ease;
}

.toggle-row.is-on .toggle-row__knob {
  transform: translateX(1rem);
}

@media (prefers-reduced-motion: reduce) {
  .toggle-row,
  .toggle-row__switch,
  .toggle-row__knob {
    transition: none !important;
  }
}
</style>
