<template>
  <div class="rep-chart-wrap">
    <div ref="scrollerRef" class="rep-chart" @scroll="updateEdges">
      <div v-for="(rep, index) in reps" :key="rep.id ?? index" class="rep-bar">
        <span class="rep-bar__weight">{{ rep.weight }}</span>
        <div class="rep-bar__track">
          <div class="rep-bar__fill" :style="{ height: `${barHeightPct(rep)}%` }" />
        </div>
        <span class="rep-bar__amount">{{ rep.amount }}</span>
      </div>
    </div>

    <!--
      Real scroll-position tracking rather than a CSS-only trick: it needs
      to reflect exactly how far there is left to scroll in each direction,
      updating live as the user scrolls, which is squarely what
      ResizeObserver/scroll events are for rather than something to fake in
      pure CSS.
    -->
    <div v-if="hasMoreLeft" class="rep-chart-fade rep-chart-fade--left" aria-hidden="true">
      <span class="rep-chart-fade__arrow">&lsaquo;</span>
    </div>
    <div v-if="hasMoreRight" class="rep-chart-fade rep-chart-fade--right" aria-hidden="true">
      <span class="rep-chart-fade__arrow">&rsaquo;</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from 'vue';

// Structural subset of WorkoutRep, so live form state (WorkoutMode's
// in-progress set, which has no entity ids yet) can render through the
// exact same chart as saved workouts on the detail page.
export interface RepChartRep {
  id?: string;
  weight: number;
  amount: number;
}

const props = defineProps<{
  reps: RepChartRep[];
}>();

const scrollerRef = ref<HTMLElement | null>(null);
const hasMoreLeft = ref(false);
const hasMoreRight = ref(false);

// Lowest rep in the set is pinned to 50% height (never vanishes, still
// reads as "the low point" rather than "empty") and the heaviest to 100%,
// with everything else interpolated linearly between.
const barHeightPct = (rep: RepChartRep): number => {
  const weights = props.reps.map((item) => item.weight);
  const heaviest = Math.max(...weights);
  const lightest = Math.min(...weights);

  if (heaviest === lightest) return 100;

  const ratio = (rep.weight - lightest) / (heaviest - lightest);
  return Math.round(50 + ratio * 50);
};

const updateEdges = () => {
  const el = scrollerRef.value;
  if (!el) return;
  hasMoreLeft.value = el.scrollLeft > 2;
  hasMoreRight.value = el.scrollLeft + el.clientWidth < el.scrollWidth - 2;
};

let resizeObserver: ResizeObserver | null = null;

onMounted(() => {
  updateEdges();
  if (scrollerRef.value) {
    resizeObserver = new ResizeObserver(updateEdges);
    resizeObserver.observe(scrollerRef.value);
  }
});

onUnmounted(() => {
  resizeObserver?.disconnect();
});
</script>

<style scoped>
.rep-chart-wrap {
  position: relative;
  flex: 1;
  min-width: 0;
}

.rep-chart {
  display: flex;
  flex-wrap: nowrap;
  gap: 0.5rem;
  overflow-x: auto;
  padding-bottom: 0.15rem;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}

.rep-chart::-webkit-scrollbar {
  display: none;
}

.rep-bar {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
  gap: 0.2rem;
  width: 2.5rem;
}

.rep-bar__weight {
  font-size: 0.68rem;
  font-weight: 700;
  color: var(--color-secondary);
}

.rep-bar__track {
  display: flex;
  align-items: flex-end;
  width: 100%;
  height: 4rem;
  background: rgba(var(--overlay-rgb), 0.06);
  border-radius: 0.3rem;
  overflow: hidden;
}

.rep-bar__fill {
  width: 100%;
  min-height: 4px;
  border-radius: 0.3rem;
  background: linear-gradient(180deg, var(--color-primary), var(--color-primary-dark));
}

.rep-bar__amount {
  padding: 0.05rem 0.4rem;
  border-radius: var(--radius-pill);
  background: rgba(var(--color-primary-rgb), 0.12);
  color: var(--color-primary);
  font-size: 0.72rem;
  font-weight: 800;
}

.rep-chart-fade {
  position: absolute;
  top: 0;
  bottom: 0.9rem;
  width: 1.75rem;
  display: flex;
  align-items: center;
  font-size: 1.1rem;
  font-weight: 700;
  color: rgba(var(--overlay-rgb), 0.55);
  pointer-events: none;
}

.rep-chart-fade--left {
  left: 0;
  justify-content: flex-start;
  background: linear-gradient(to right, var(--color-surface-alt) 40%, transparent);
}

.rep-chart-fade--right {
  right: 0;
  justify-content: flex-end;
  background: linear-gradient(to left, var(--color-surface-alt) 40%, transparent);
}

@media (max-width: 480px) {
  .rep-bar {
    width: 2.1rem;
  }

  .rep-bar__track {
    height: 3.25rem;
  }
}
</style>
