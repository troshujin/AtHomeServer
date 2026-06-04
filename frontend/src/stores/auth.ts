import { ref } from 'vue';
import type { User } from '@/types/user';
import { defineStore } from 'pinia';
import type { PermissionShort } from '@/types/trojonetworks/permission';
import { usePermissionChecker } from '@/composables/auth/usePermissionChecker';
import { useRouter } from 'vue-router';
import { API_BASE_URL } from '@/lib/config';

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter();

  const permChecker = usePermissionChecker();

  const currentUser = ref<User | null>(null);
  const permissionCollection = ref<PermissionShort[]>([]);

  const loading = ref(false);
  const isAuthenticated = ref(false);
  const error = ref<string | null>(null);

  const canI = {
    bypassEverything: () =>
      permChecker.hasPermission(permissionCollection.value, permChecker.permissions.Administrator),
  };

  async function login() {
    router.push(API_BASE_URL + '/auth/login');
  }

  async function signUp() {
    router.push(API_BASE_URL + '/auth/signup');
  }

  function logout() {
    router.push(API_BASE_URL + '/auth/logout');
  }

  return {
    // State
    loading,
    error,

    // Data
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
