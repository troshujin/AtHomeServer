<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container-fluid">
        <RouterLink class="navbar-brand" to="/">AtHomeServer</RouterLink>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav">
            <li class="nav-item">
              <RouterLink class="nav-link active" aria-current="page" to="/">Home</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link" to="#">Features</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link" to="gym">Gym</RouterLink>
            </li>
            <span>|</span>
            <li class="nav-item" v-if="!authStore.currentUser">
              <a class="nav-link" :href="`${API_BASE_URL}/auth/login`" tabindex="-1">Login</a>
            </li>
            <li class="nav-item" v-if="authStore.currentUser">
              <RouterLink class="nav-link" to="me">{{ authStore.currentUser.username }}</RouterLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { API_BASE_URL } from '@/lib/config';
import { useAuthStore } from '@/stores/auth';
import { onMounted } from 'vue';

const authStore = useAuthStore();

onMounted(async () => {
  await authStore.getCurrentUser();
})
</script>
