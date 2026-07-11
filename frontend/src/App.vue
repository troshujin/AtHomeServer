<template>
  <div>
    <NavBar />
  </div>

  <RouterView />

  <ThemeMenu />
</template>

<script setup lang="ts">
import NavBar from './components/layout/NavBar.vue';
import ThemeMenu from './components/common/ThemeMenu.vue';
</script>

<style scoped></style>
