<template>
  <article class="workout-card" :style="themeStyle">
    <span class="workout-card__icon" aria-hidden="true">{{ icon }}</span>

    <RouterLink v-if="user" class="workout-card__avatar" :to="`/gym/users/${user.id}`">
      {{ initials }}
    </RouterLink>

    <div class="workout-card__body">
      <div class="workout-card__heading">
        <RouterLink v-if="user" class="workout-card__user" :to="`/gym/users/${user.id}`">
          {{ user.username }}
        </RouterLink>
        <RouterLink class="workout-card__name" :to="`/gym/workouts/${workout.id}`">
          {{ workout.name }}
        </RouterLink>
      </div>

      <div class="workout-card__meta">
        <span class="workout-card__volume">{{ formattedVolume }} kg lifted</span>
        <span class="workout-card__dot" aria-hidden="true">&middot;</span>
        <span class="workout-card__date">{{ formatDateShort(workout.startedAt) }}</span>
      </div>
    </div>
  </article>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import { useWorkoutUtils } from '@/composables/gym/utils/useWorkoutUtils';
import { formatDateShort } from '@/lib/formatters';
import type { Workout } from '@/types/gym';
import type { User } from '@/types/user';

const props = defineProps<{
  workout: Workout;
  user?: User;
}>();

const workoutUtils = useWorkoutUtils(props.workout);

const formattedVolume = computed(() => new Intl.NumberFormat('nl-NL').format(workoutUtils.getVolume()));

const initials = computed(() => (props.user?.username.slice(0, 2).toUpperCase() ?? ''));

// A deterministic per-card accent + icon, so the carousel reads as a row of
// distinct trading cards rather than repeats of the same white tile.
const CARD_THEMES: [string, string][] = [
  ['#3b82f6', '#8b5cf6'],
  ['#10b981', '#0891b2'],
  ['#f43f5e', '#fb923c'],
  ['#8b5cf6', '#ec4899'],
  ['#f59e0b', '#ef4444'],
  ['#06b6d4', '#6366f1'],
];

const TYPE_ICONS: Record<string, string> = {
  'push day': '💪',
  'pull day': '🏋️',
  'leg day': '🦵',
  'full body': '🔥',
  'upper body': '⚡',
};

const hashString = (value: string): number => {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (Math.imul(hash, 31) + value.charCodeAt(i)) >>> 0;
  }
  return hash;
};

const theme = computed(() => CARD_THEMES[hashString(props.workout.id) % CARD_THEMES.length]);

const themeStyle = computed(() => ({
  '--card-from': theme.value[0],
  '--card-to': theme.value[1],
}));

const icon = computed(() => TYPE_ICONS[props.workout.name.trim().toLowerCase()] ?? '🏆');
</script>

<style scoped>
.workout-card {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 0.75rem 0.5rem;
  border-radius: var(--radius-md);
  transition: background-color 0.15s ease;
}

.workout-card:hover {
  background: rgba(var(--overlay-rgb), 0.035);
}

.workout-card__icon {
  display: none;
}

.workout-card__avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-accent), var(--color-primary));
  color: #fff;
  font-size: 0.8rem;
  font-weight: 700;
  text-decoration: none;
}

.workout-card__body {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  min-width: 0;
}

.workout-card__heading {
  display: flex;
  align-items: baseline;
  gap: 0.4rem;
  flex-wrap: wrap;
}

.workout-card__user {
  font-weight: 700;
  font-size: 0.9rem;
  color: var(--color-secondary);
  text-decoration: none;
}

.workout-card__user:hover {
  color: var(--color-primary);
}

.workout-card__name {
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--color-primary);
  text-decoration: none;
}

.workout-card__name:hover {
  text-decoration: underline;
}

.workout-card__meta {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.8rem;
  color: var(--color-text);
  opacity: 0.65;
}

/*
 * Square-ish carousel card on small screens: a colorful "trading card" look
 * (deterministic per-workout gradient + a type icon) instead of a plain
 * white tile, with the lifted-volume figure as the hero stat.
 */
@media (max-width: 640px) {
  .workout-card {
    position: relative;
    overflow: hidden;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    height: 100%;
    width: 100%;
    gap: 0.5rem;
    padding: 1.5rem 1.1rem;
    border-radius: var(--radius-lg);
    background: linear-gradient(155deg, var(--card-from), var(--card-to));
    border: 1px solid rgba(255, 255, 255, 0.18);
    box-shadow: var(--surface-shadow-lg);
  }

  .workout-card::before {
    content: '';
    position: absolute;
    inset: -20% -20% auto auto;
    width: 65%;
    aspect-ratio: 1;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.28), transparent 65%);
    pointer-events: none;
  }

  .workout-card:hover {
    background: linear-gradient(155deg, var(--card-from), var(--card-to));
  }

  .workout-card__icon {
    display: block;
    font-size: 2.1rem;
    line-height: 1;
    filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.15));
  }

  .workout-card__avatar {
    width: 2.75rem;
    height: 2.75rem;
    font-size: 0.85rem;
    background: rgba(255, 255, 255, 0.22);
    border: 1px solid rgba(255, 255, 255, 0.4);
    backdrop-filter: blur(6px);
  }

  .workout-card__body {
    position: relative;
    align-items: center;
    gap: 0.35rem;
  }

  .workout-card__heading {
    flex-direction: column;
    align-items: center;
    gap: 0.1rem;
  }

  .workout-card__user {
    color: rgba(255, 255, 255, 0.85);
    font-size: 0.8rem;
  }

  .workout-card__user:hover {
    color: #fff;
  }

  .workout-card__name {
    color: #fff;
    font-size: 1.05rem;
    font-weight: 700;
    text-shadow: 0 1px 4px rgba(0, 0, 0, 0.12);
  }

  .workout-card__meta {
    flex-direction: column;
    gap: 0.15rem;
    color: rgba(255, 255, 255, 0.9);
    opacity: 1;
  }

  .workout-card__volume {
    font-size: 1.3rem;
    font-weight: 800;
    letter-spacing: -0.01em;
  }

  .workout-card__dot {
    display: none;
  }

  .workout-card__date {
    font-size: 0.75rem;
    color: rgba(255, 255, 255, 0.7);
  }
}
</style>
