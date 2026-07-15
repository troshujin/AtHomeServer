<template>
  <button
    type="button"
    class="stat-tile"
    :class="{ 'is-selected': selected }"
    :disabled="disabled"
    :aria-pressed="selected"
    @click="emit('toggle')"
  >
    <span class="stat-tile__icon" aria-hidden="true">{{ definition.icon }}</span>

    <span class="stat-tile__body">
      <span class="stat-tile__headline">
        <span class="stat-tile__value">{{ definition.format(value) }}</span>
        <span class="stat-tile__label">{{ definition.label }}</span>
      </span>
      <span class="stat-tile__description">{{ definition.description }}</span>
    </span>

    <span class="stat-tile__state" aria-hidden="true">
      <Icon :icon="selected ? 'md.check' : 'md.add'" />
    </span>
  </button>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import Icon from '@/components/common/Icon.vue';
import { getStatDefinition } from '@/lib/profileStats';

/**
 * One toggleable stat in the profile page's "card stats" picker: the stat's
 * live value as its own headline (seeing the number *is* the pitch), a
 * one-line description, and an add/check state glyph. `disabled` is for
 * "card is full" - selected tiles stay tappable so removing is always as
 * easy as adding (STYLE_GUIDE §7's no-friction-on-opt-out rule).
 */
const props = defineProps<{
  statKey: string;
  value: number;
  selected: boolean;
  disabled?: boolean;
}>();

const emit = defineEmits<{
  toggle: [];
}>();

const definition = computed(() => getStatDefinition(props.statKey));
</script>

<style scoped>
.stat-tile {
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

.stat-tile:hover {
  background: rgba(var(--overlay-rgb), 0.06);
}

.stat-tile.is-selected {
  border-color: rgba(var(--color-primary-rgb), 0.55);
  background: rgba(var(--color-primary-rgb), 0.08);
}

.stat-tile:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.stat-tile__icon {
  flex-shrink: 0;
  font-size: 1.35rem;
  line-height: 1;
}

.stat-tile__body {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  min-width: 0;
  flex: 1;
}

.stat-tile__headline {
  display: flex;
  align-items: baseline;
  gap: 0.35rem;
  flex-wrap: wrap;
}

.stat-tile__value {
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-secondary);
}

.stat-tile__label {
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--color-text);
  opacity: 0.75;
}

.stat-tile__description {
  font-size: 0.75rem;
  color: var(--color-text);
  opacity: 0.65;
}

.stat-tile__state {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 50%;
  background: rgba(var(--overlay-rgb), 0.07);
  color: var(--color-text);
  font-size: 0.9rem;
  transition:
    background-color 0.15s ease,
    color 0.15s ease;
}

.stat-tile.is-selected .stat-tile__state {
  background: var(--color-primary);
  color: #fff;
}

@media (prefers-reduced-motion: reduce) {
  .stat-tile,
  .stat-tile__state {
    transition: none !important;
  }
}
</style>
