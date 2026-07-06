<template>
  <div>
    <NavBar />
  </div>

  <RouterView />

  <ThemeMenu />
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import NavBar from './components/layout/NavBar.vue';
import ThemeMenu from './components/common/ThemeMenu.vue';

const getAllCookies = (): Record<string, string> => {
  if (!document.cookie) return {};

  return document.cookie.split(';').reduce((cookies, cookieString) => {
    const [key, value] = cookieString.trim().split('=');
    if (key && value) {
      cookies[key] = decodeURIComponent(value);
    }
    return cookies;
  }, {} as Record<string, string>);
};

onMounted(() => {
  const myCookies = getAllCookies();
  console.log('All available frontend cookies:', myCookies);
});
</script>

<style scoped></style>
