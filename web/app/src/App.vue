<template>
  <div>
    <NavBar />
  </div>
  <h1>You did it!</h1>
  <p>
    Visit <a href="https://vuejs.org/" target="_blank" rel="noopener">vuejs.org</a> to read the
    documentation
  </p>
</template>

<script setup lang="ts">
import NavBar from './components/layout/NavBar.vue';

console.log('Hello, world!');
</script>

<style scoped></style>
