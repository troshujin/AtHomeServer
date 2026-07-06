<template>
  <PageShell class="gym-home" max-width="1200px">
    <PageHeader title="Gym" subtitle="Track your lifts, keep up with friends, and stay motivated." />

    <main class="gym-home__grid">
      <FriendsSection />
      <MyLiftsSection />
      <PromotedSection />
    </main>
  </PageShell>
</template>

<script lang="ts" setup>
import PageHeader from '@/components/common/PageHeader.vue';
import PageShell from '@/components/common/PageShell.vue';
import FriendsSection from '@/components/gym/home/FriendsSection.vue';
import MyLiftsSection from '@/components/gym/home/MyLiftsSection.vue';
import PromotedSection from '@/components/gym/home/PromotedSection.vue';
</script>

<style scoped>
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
