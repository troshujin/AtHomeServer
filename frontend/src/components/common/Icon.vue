<template>
  <svg
    class="icon"
    :viewBox="def.viewBox"
    fill="currentColor"
    aria-hidden="true"
    focusable="false"
  >
    <path :d="def.path" />
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { resolveIcon, type IconName } from '@/lib/icons';

// `icon` is the full IconName union ('md.download', 'custom.barbell', ...),
// so a typo fails type-check instead of rendering an empty box. Sizing and
// color are the caller's: the glyph is 1em of `currentColor`, so it follows
// the surrounding font-size/color like a text character would.
const props = defineProps<{
  icon: IconName;
}>();

const def = computed(() => resolveIcon(props.icon));
</script>

<style scoped>
.icon {
  display: inline-block;
  width: 1em;
  height: 1em;
  flex-shrink: 0;
  vertical-align: -0.125em;
}
</style>
