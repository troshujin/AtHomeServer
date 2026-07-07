<template>
  <div class="status-page">
    <p class="status-page__code" aria-hidden="true">!</p>
    <h1 class="status-page__title">Something went wrong</h1>
    <p class="status-page__message">"{{ message }}"</p>

    <div class="status-page__actions">
      <AppButton variant="primary" size="lg" to="/">Back to home</AppButton>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import AppButton from '@/components/common/AppButton.vue';

const route = useRoute();

const message = computed(() => {
  const q = route.query.q;
  const raw = Array.isArray(q) ? q[0] : q;
  return raw || 'An unexpected error occurred.';
});
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

.status-page__code {
  margin: 0;
  font-size: 5rem;
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.03em;
  color: var(--color-danger);
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
