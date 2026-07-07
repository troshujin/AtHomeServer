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
          <button
            v-if="!authStore.currentUser"
            type="button"
            class="btn-login"
            @click="authStore.login()"
          >
            Log in
          </button>
          <RouterLink v-else class="user-chip" :to="profileLink" @click="closeMenu">
            <span class="user-avatar">{{ initials }}</span>
            <span class="user-name">{{ displayName }}</span>
          </RouterLink>
        </div>

        <!-- Only rendered when the browser has actually offered
             installability (usePwaInstall) - never a dead button. -->
        <div v-if="canInstall" class="install-slot">
          <button class="btn-install" type="button" @click="installApp">
            <span aria-hidden="true">&#8595;</span> Install app
          </button>
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
          <button
            v-if="!authStore.currentUser"
            type="button"
            class="btn-login btn-login--block"
            @click="authStore.login()"
          >
            Log in
          </button>
          <RouterLink v-else class="user-chip user-chip--block" :to="profileLink" @click="closeMenu">
            <span class="user-avatar">{{ initials }}</span>
            <span class="user-name">{{ displayName }}</span>
          </RouterLink>

          <button v-if="canInstall" class="mobile-theme-button" type="button" @click="installApp">
            <span class="mobile-theme-button__icon" aria-hidden="true">&#8595;</span>
            <span class="mobile-theme-button__label">Install as app</span>
          </button>

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
import usePwaInstall from '@/composables/usePwaInstall';
import { formatUserName } from '@/lib/formatters';
import { useAuthStore } from '@/stores/auth';
import { getThemeDefinition, useThemeStore } from '@/stores/theme';

const authStore = useAuthStore();
const themeStore = useThemeStore();
const route = useRoute();
const { canInstall, install } = usePwaInstall();

const installApp = () => {
  closeMenu();
  void install();
};

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

// `/me` identities don't always carry a username - formatUserName falls
// back through real name and email.
const displayName = computed(() =>
  authStore.currentUser ? formatUserName(authStore.currentUser) : '',
);

const initials = computed(() => displayName.value.slice(0, 2).toUpperCase());

// The chip used to point at a `/me` route that never existed; the user's
// own profile page is the real destination.
const profileLink = computed(() => `/gym/users/${authStore.currentUser?.id ?? ''}`);

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
  await authStore.init();
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
