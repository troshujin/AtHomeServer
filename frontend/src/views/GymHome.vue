<template>
  <div class="gym-home">
    <header class="gym-home__header">
      <h1 class="gym-home__title">Gym</h1>
      <p class="gym-home__subtitle">Track your lifts, keep up with friends, and stay motivated.</p>
    </header>

    <main class="gym-home__grid">
      <FriendsSection />
      <MyLiftsSection />
      <PromotedSection />
    </main>
  </div>
</template>

<script lang="ts" setup>
import FriendsSection from '@/components/gym/home/FriendsSection.vue';
import MyLiftsSection from '@/components/gym/home/MyLiftsSection.vue';
import PromotedSection from '@/components/gym/home/PromotedSection.vue';
</script>

<style scoped>
.gym-home {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1.5rem 3rem;
}

.gym-home__header {
  margin-bottom: 1.75rem;
}

.gym-home__title {
  margin: 0 0 0.35rem;
  font-size: 1.9rem;
}

.gym-home__subtitle {
  margin: 0;
  color: var(--color-text);
  opacity: 0.7;
}

.gym-home__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
}

@media (max-width: 900px) {
  .gym-home__grid {
    grid-template-columns: 1fr;
  }
}
</style>
