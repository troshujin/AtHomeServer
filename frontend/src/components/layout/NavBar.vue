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

        <div class="theme-switcher-slot">
          <ThemeSwitcher />
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

    <Teleport to="body">
    <Transition name="mobile-menu">
      <div v-if="isMenuOpen" id="mobile-menu" ref="mobileMenuRef" class="mobile-menu">
        <div class="mobile-menu__scroll">
          <ul class="mobile-links">
            <li v-for="link in navLinks" :key="link.to">
              <RouterLink class="mobile-link" :to="link.to" active-class="is-active" @click="closeMenu">
                {{ link.label }}
              </RouterLink>
            </li>
          </ul>
        </div>

        <div class="mobile-menu__footer">
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

          <button class="mobile-theme-button" type="button" @click="openThemeMenu">
            <span class="mobile-theme-button__icon" aria-hidden="true">{{ currentTheme.icon }}</span>
            <span class="mobile-theme-button__label">Theme: {{ currentTheme.name }}</span>
            <span class="mobile-theme-button__chevron" aria-hidden="true">&rsaquo;</span>
          </button>
        </div>
      </div>
    </Transition>
    </Teleport>
  </header>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import ThemeSwitcher from '@/components/common/ThemeSwitcher.vue';
import { API_BASE_URL } from '@/lib/config';
import { useAuthStore } from '@/stores/auth';
import { getThemeDefinition, useThemeStore } from '@/stores/theme';

const authStore = useAuthStore();
const themeStore = useThemeStore();
const route = useRoute();

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/gym', label: 'Gym' },
];

const headerRef = ref<HTMLElement | null>(null);
// The mobile menu is <Teleport>-ed to <body> (so its `position: fixed` isn't
// contained by .app-header's own backdrop-filter, which would otherwise
// make it fixed relative to the header's small box instead of the
// viewport) - so it needs its own ref for the outside-click check below.
const mobileMenuRef = ref<HTMLElement | null>(null);
const isMenuOpen = ref(false);
const isScrolled = ref(false);

const initials = computed(() => {
  const name = authStore.currentUser?.username ?? '';
  return name.slice(0, 2).toUpperCase();
});

const currentTheme = computed(() => getThemeDefinition(themeStore.theme));

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const closeMenu = () => {
  isMenuOpen.value = false;
};

const openThemeMenu = () => {
  closeMenu();
  themeStore.openPicker();
};

const handleScroll = () => {
  isScrolled.value = window.scrollY > 8;
};

const handleOutsideClick = (event: MouseEvent) => {
  if (!isMenuOpen.value) return;
  const target = event.target as Node;
  const isInsideHeader = headerRef.value?.contains(target) ?? false;
  const isInsideMobileMenu = mobileMenuRef.value?.contains(target) ?? false;
  if (!isInsideHeader && !isInsideMobileMenu) {
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
