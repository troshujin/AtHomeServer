<template>
  <article class="profile-card" :style="themeStyle" :aria-label="`${user.username}'s profile card`">
    <header class="profile-card__identity">
      <span class="profile-card__avatar" aria-hidden="true">{{ initials }}</span>
      <div class="profile-card__who">
        <span class="profile-card__name">{{ user.username }}</span>
        <span v-if="memberSince" class="profile-card__since"> Member since {{ sinceLabel }} </span>
      </div>
    </header>

    <div v-if="heroStat" class="profile-card__hero">
      <span class="profile-card__hero-icon" aria-hidden="true">{{ heroStat.icon }}</span>
      <span class="profile-card__hero-value">{{ heroStat.formattedValue }}</span>
      <span class="profile-card__hero-label">{{ heroStat.label }}</span>
    </div>
    <p v-else-if="emptyMessage" class="profile-card__empty">{{ emptyMessage }}</p>

    <ul v-if="supportingStats.length" class="profile-card__stats">
      <li v-for="stat in supportingStats" :key="stat.key" class="profile-card__stat">
        <span class="profile-card__stat-icon" aria-hidden="true">{{ stat.icon }}</span>
        <span class="profile-card__stat-value">{{ stat.formattedValue }}</span>
        <span class="profile-card__stat-label">{{ stat.label }}</span>
      </li>
    </ul>
  </article>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { getCardTheme } from '@/lib/cardThemes';
import { formatDate } from '@/lib/formatters';
import { getStatDefinition } from '@/lib/profileStats';
import type { ProfileStat } from '@/types/profile';
import type { User } from '@/types/user';

/**
 * A user's shareable "trading card" (STYLE_GUIDE §7): identity up top, then
 * dynamic stat slots - slot 0 renders as the card's single hero stat, the
 * rest as a supporting row. Slots are data-driven (`stats`), so what shows
 * is whatever the user pinned (gym stats today, any future `music.*` etc.
 * stat tomorrow) - the card itself knows nothing about stat kinds, it just
 * resolves each key through the lib/profileStats.ts registry.
 */
const props = defineProps<{
  user: User;
  /** When the identity joined - the card's one piece of non-stat flavor. */
  memberSince?: Date | null;
  /** Slot-ordered pinned stats; index 0 is the hero slot. */
  stats: ProfileStat[];
  /** Shown in the hero area when no stats are pinned (e.g. the preview's nudge). */
  emptyMessage?: string;
}>();

const initials = computed(() => props.user.username.slice(0, 2).toUpperCase());

// Deterministic per-user gradient from the shared engagement-bait set - the
// same user always gets the same card color (see lib/cardThemes.ts; like
// WorkoutCard, deliberately theme-invariant per STYLE_GUIDE §9).
const themeStyle = computed(() => {
  const [from, to] = getCardTheme(props.user.id);
  return { '--card-from': from, '--card-to': to };
});

const sinceLabel = computed(() =>
  props.memberSince
    ? formatDate(props.memberSince, 'nl-NL', { month: 'long', year: 'numeric' })
    : '',
);

const resolvedStats = computed(() =>
  props.stats.map((stat) => {
    const definition = getStatDefinition(stat.key);
    return {
      key: stat.key,
      icon: definition.icon,
      label: definition.label,
      formattedValue: definition.format(stat.value),
    };
  }),
);

const heroStat = computed(() => resolvedStats.value[0] ?? null);
const supportingStats = computed(() => resolvedStats.value.slice(1));
</script>

<style scoped>
.profile-card {
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
  width: 100%;
  padding: 1.35rem 1.25rem;
  border-radius: var(--radius-lg);
  background: linear-gradient(155deg, var(--card-from), var(--card-to));
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow: var(--surface-shadow-lg);
  color: #fff;
}

/* Same soft radial corner highlight as WorkoutCard's carousel mode. */
.profile-card::before {
  content: '';
  position: absolute;
  inset: -20% -20% auto auto;
  width: 65%;
  aspect-ratio: 1;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.28), transparent 65%);
  pointer-events: none;
}

.profile-card__identity {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.85rem;
}

.profile-card__avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.22);
  border: 1px solid rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(6px);
  font-size: 0.95rem;
  font-weight: 700;
}

.profile-card__who {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  min-width: 0;
}

.profile-card__name {
  font-size: 1.2rem;
  font-weight: 800;
  letter-spacing: -0.01em;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.12);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.profile-card__since {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.75);
}

.profile-card__hero {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.2rem;
  text-align: center;
  padding: 0.35rem 0;
}

.profile-card__hero-icon {
  font-size: 1.6rem;
  line-height: 1;
  filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.15));
}

.profile-card__hero-value {
  font-size: 2.4rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1.1;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.12);
}

.profile-card__hero-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.85);
}

.profile-card__empty {
  position: relative;
  margin: 0;
  padding: 0.75rem 0;
  text-align: center;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.8);
}

.profile-card__stats {
  position: relative;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(0, 1fr));
  gap: 0.75rem;
  margin: 0;
  padding: 0.9rem 0 0;
  list-style: none;
  border-top: 1px solid rgba(255, 255, 255, 0.25);
}

.profile-card__stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.15rem;
  text-align: center;
  min-width: 0;
}

.profile-card__stat-icon {
  font-size: 1.05rem;
  line-height: 1;
}

.profile-card__stat-value {
  font-size: 1.05rem;
  font-weight: 700;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.12);
}

.profile-card__stat-label {
  font-size: 0.68rem;
  color: rgba(255, 255, 255, 0.8);
}
</style>
