<template>
  <Modal title="Install AtHomeServer" size="sm" @close="$emit('close')">
    <p class="install-help__intro">{{ content.intro }}</p>
    <ol class="install-help__steps">
      <li v-for="step in content.steps" :key="step.text">
        <Icon v-if="step.icon" class="install-help__glyph" :icon="step.icon" />
        {{ step.text }}
      </li>
    </ol>

    <template #footer>
      <AppButton variant="primary" @click="$emit('close')">Got it</AppButton>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import AppButton from '@/components/common/AppButton.vue';
import Icon from '@/components/common/Icon.vue';
import Modal from '@/components/common/Modal.vue';
import type { InstallPlatform } from '@/composables/usePwaInstall';
import type { IconName } from '@/lib/icons';

// Manual "Add to Home Screen" walkthrough, for browsers with no
// programmatic install prompt (iOS entirely, Firefox, or Chromium on a
// plain-HTTP origin) - see usePwaInstall for when this is shown.
const props = defineProps<{
  platform: InstallPlatform;
}>();

defineEmits<{
  close: [];
}>();

interface InstallStep {
  text: string;
  // The glyph the step tells the user to look for in their browser's UI,
  // shown inline so they can match it by shape, not by description.
  icon?: IconName;
}

const CONTENT: Record<InstallPlatform, { intro: string; steps: InstallStep[] }> = {
  ios: {
    intro: 'On iPhone and iPad, apps install from the share menu:',
    steps: [
      { icon: 'md.ios-share', text: 'Tap the Share button in the browser toolbar.' },
      { text: 'Scroll down and tap "Add to Home Screen".' },
      { text: 'Tap "Add" - the app appears on your home screen.' },
    ],
  },
  android: {
    intro: 'Install from your browser’s menu:',
    steps: [
      { icon: 'md.more-vert', text: 'Open the browser menu.' },
      { text: 'Tap "Add to Home screen" or "Install app".' },
      { text: 'Confirm - the app appears on your home screen.' },
    ],
  },
  desktop: {
    intro: 'Install from the address bar:',
    steps: [
      { text: 'Look for an install icon at the right end of the address bar.' },
      { text: 'Click it and confirm to add the app.' },
    ],
  },
};

const content = computed(() => CONTENT[props.platform]);
</script>

<style scoped>
.install-help__intro {
  margin: 0 0 0.75rem;
  color: var(--color-text);
  line-height: 1.5;
}

.install-help__steps {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin: 0;
  padding-left: 1.25rem;
  color: var(--color-text);
  line-height: 1.5;
}

.install-help__glyph {
  font-size: 1.1rem;
  color: var(--color-secondary);
}
</style>
