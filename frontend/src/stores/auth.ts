import { computed, ref, type Ref } from 'vue';
import type { CurrentUser } from '@/types/user';
import { defineStore } from 'pinia';
import type { PermissionShort } from '@/types/trojonetworks/permission';
import { usePermissionChecker } from '@/composables/auth/usePermissionChecker';
import { useRouter } from 'vue-router';
import { API_BASE_URL } from '@/lib/config';
import useCurrentUser from '@/composables/auth/useCurrentUser';

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter();
  const {
    execute: fetchMe,
    loading: fetchMeLoading,
    error: fetchMeError,
    data: fetchMeResult,
  } = useCurrentUser().fetchMe;

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

  const getCurrentUser = async () => {
    await fetchMe();
  };

  const login = async () => {
    router.push(API_BASE_URL + '/auth/login');
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
    getCurrentUser,
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
