<template>
  <div class="status-page">
    <p class="status-page__code" aria-hidden="true">{{ code }}</p>
    <h1 class="status-page__title">{{ copy.title }}</h1>
    <p class="status-page__message">{{ copy.message }}</p>

    <div class="status-page__actions">
      <AppButton v-if="code === 401" variant="primary" size="lg" :href="loginUrl">Log in</AppButton>
      <AppButton :variant="code === 401 ? 'ghost' : 'primary'" :size="code === 401 ? 'md' : 'lg'" to="/">
        Back to home
      </AppButton>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import AppButton from '@/components/common/AppButton.vue';
import { API_BASE_URL } from '@/lib/config';

/**
 * One view for every "you can't be here" screen - 401 (api client redirects
 * here on an unauthenticated response), 403 (same, for forbidden), and the
 * router's catch-all 404. Same shape, different copy and actions, so they
 * share a component the way the friends/promoted feeds do.
 */
const props = defineProps<{
  code: 401 | 403 | 404;
}>();

const COPY = {
  401: {
    title: 'Log in to continue',
    message: 'This page is only visible once you’re logged in.',
  },
  403: {
    title: 'No access',
    message: 'You’re logged in, but this page isn’t available to your account.',
  },
  404: {
    title: 'Page not found',
    message: 'This page doesn’t exist — the link may be old or mistyped.',
  },
} as const;

const copy = computed(() => COPY[props.code]);

const loginUrl = `${API_BASE_URL}/auth/login`;
</script>

<style scoped>
.status-page {
  max-width: 480px;
  margin: 0 auto;
  padding: 4rem 1.5rem 3rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.5rem;
}

/* The one oversized "hero number" this screen gets - the same single-big-
   figure treatment as a workout card's volume stat. */
.status-page__code {
  margin: 0;
  font-size: 5rem;
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.03em;
  background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
}

.status-page__title {
  margin: 0.5rem 0 0;
  font-size: 1.5rem;
}

.status-page__message {
  margin: 0;
  color: var(--color-text);
  opacity: 0.7;
}

.status-page__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-top: 1.25rem;
}
</style>
