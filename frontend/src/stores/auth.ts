import { computed, ref, type Ref } from 'vue';
import type { CurrentUser } from '@/types/user';
import { defineStore } from 'pinia';
import type { PermissionShort } from '@/types/trojonetworks/permission';
import { usePermissionChecker } from '@/composables/auth/usePermissionChecker';
import { useRouter } from 'vue-router';
import { API_BASE_URL } from '@/lib/config';
import { hasCookie, SESSION_HINT_COOKIE } from '@/lib/cookies';
import useCurrentUser from '@/composables/auth/useCurrentUser';

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter();
  const { fetchMe: fetchMeApi, probeMe } = useCurrentUser();
  const {
    execute: fetchMe,
    loading: fetchMeLoading,
    error: fetchMeError,
    data: fetchMeResult,
  } = fetchMeApi;

  const permChecker = usePermissionChecker();

  const currentUser: Ref<CurrentUser | null> = fetchMeResult;
  const permissionCollection = ref<PermissionShort[]>([]);

  const loading: Ref<boolean> = fetchMeLoading;
  const error: Ref<string | null> = fetchMeError;
  const isAuthenticated = computed(() => currentUser.value !== null);

  const canI = {
    bypassEverything: () =>
      permChecker.hasPermission(permissionCollection.value, permChecker.permissions.Administrator),
  };

  // Called on app mount. The real session cookie is httpOnly, so we can't
  // read it directly - the hint cookie is a client-visible stand-in the
  // backend sets/clears alongside it. Skipping `/me` when it's absent is
  // what keeps an anonymous visit from being bounced through the 401/403
  // redirect on every single page load (see StatusView/ErrorView).
  const init = async () => {
    if (!hasCookie(SESSION_HINT_COOKIE)) return;
    await fetchMe();
  };

  const login = async () => {
    try {
      await probeMe();
      // Session's actually still valid (hint cookie missing/stale but the
      // real one isn't) - just hydrate the store instead of round-tripping
      // through the IdP for no reason.
      await fetchMe();
    } catch {
      window.location.href = `${API_BASE_URL}/auth/login`;
    }
  };

  const signUp = async () => {
    router.push(API_BASE_URL + '/auth/signup');
  };

  const logout = () => {
    window.location.href = `${API_BASE_URL}/auth/logout`;
  };

  return {
    // State
    loading,
    error,

    // Data
    init,
    currentUser,

    // Computed
    isAuthenticated,
    canI,

    // Actions
    login,
    signUp,
    logout,
  };
});
