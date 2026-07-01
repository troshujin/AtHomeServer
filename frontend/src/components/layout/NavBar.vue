<template>
  <header ref="headerRef" class="app-header" :class="{ 'is-scrolled': isScrolled, 'is-open': isMenuOpen }">
    <nav class="navbar" aria-label="Main navigation">
      <RouterLink class="navbar-brand" to="/" @click="closeMenu">
        <span class="brand-mark">HS</span>
        <span class="brand-name">AtHomeServer</span>
      </RouterLink>

      <ul class="navbar-links">
        <li v-for="link in navLinks" :key="link.to">
          <RouterLink class="nav-link" :to="link.to" active-class="is-active">{{ link.label }}</RouterLink>
        </li>
      </ul>

      <div class="navbar-actions">
        <div class="auth-inline">
          <a
            v-if="!authStore.currentUser"
            class="btn-login"
            :href="`${API_BASE_URL}/auth/login`"
          >
            Log in
          </a>
          <RouterLink v-else class="user-chip" to="me" @click="closeMenu">
            <span class="user-avatar">{{ initials }}</span>
            <span class="user-name">{{ authStore.currentUser.username }}</span>
          </RouterLink>
        </div>

        <button
          class="menu-toggle"
          type="button"
          :aria-expanded="isMenuOpen"
          aria-controls="mobile-menu"
          aria-label="Toggle navigation menu"
          @click="toggleMenu"
        >
          <span class="menu-toggle-bar" />
          <span class="menu-toggle-bar" />
          <span class="menu-toggle-bar" />
        </button>
      </div>
    </nav>

    <Transition name="dropdown">
      <div v-if="isMenuOpen" id="mobile-menu" class="mobile-menu">
        <ul class="mobile-links">
          <li v-for="link in navLinks" :key="link.to">
            <RouterLink class="mobile-link" :to="link.to" active-class="is-active" @click="closeMenu">
              {{ link.label }}
            </RouterLink>
          </li>
        </ul>

        <div class="mobile-actions">
          <a
            v-if="!authStore.currentUser"
            class="btn-login btn-login--block"
            :href="`${API_BASE_URL}/auth/login`"
          >
            Log in
          </a>
          <RouterLink v-else class="user-chip user-chip--block" to="me" @click="closeMenu">
            <span class="user-avatar">{{ initials }}</span>
            <span class="user-name">{{ authStore.currentUser.username }}</span>
          </RouterLink>
        </div>
      </div>
    </Transition>
  </header>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { API_BASE_URL } from '@/lib/config';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const route = useRoute();

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/gym', label: 'Gym' },
];

const headerRef = ref<HTMLElement | null>(null);
const isMenuOpen = ref(false);
const isScrolled = ref(false);

const initials = computed(() => {
  const name = authStore.currentUser?.username ?? '';
  return name.slice(0, 2).toUpperCase();
});

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const closeMenu = () => {
  isMenuOpen.value = false;
};

const handleScroll = () => {
  isScrolled.value = window.scrollY > 8;
};

const handleOutsideClick = (event: MouseEvent) => {
  if (!isMenuOpen.value) return;
  if (headerRef.value && !headerRef.value.contains(event.target as Node)) {
    closeMenu();
  }
};

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') closeMenu();
};

const desktopQuery = window.matchMedia('(min-width: 901px)');
const handleViewportChange = (event: MediaQueryListEvent) => {
  if (event.matches) closeMenu();
};

watch(() => route.fullPath, closeMenu);

onMounted(async () => {
  await authStore.getCurrentUser();
  window.addEventListener('scroll', handleScroll, { passive: true });
  document.addEventListener('click', handleOutsideClick);
  document.addEventListener('keydown', handleKeydown);
  desktopQuery.addEventListener('change', handleViewportChange);
  handleScroll();
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
  document.removeEventListener('click', handleOutsideClick);
  document.removeEventListener('keydown', handleKeydown);
  desktopQuery.removeEventListener('change', handleViewportChange);
});
</script>
