import { safeBtoa } from '@/lib/utils';
import { useAuthStore } from '@/stores/auth';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
      meta: {
        title: 'Home',
      },
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/views/ProfileView.vue'),
      meta: {
        title: 'Profile',
        requiresAuth: true,
      },
    },
    {
      path: '/friends',
      name: 'friends',
      component: () => import('@/views/FriendsView.vue'),
      meta: {
        title: 'Friends',
        requiresAuth: true,
      },
    },
    {
      path: '/users/:id',
      name: 'user-card',
      component: () => import('@/views/UserCardView.vue'),
      props: true,
      meta: {
        title: 'Profile',
        requiresAuth: true,
      },
    },
    {
      path: '/gym',
      name: 'gym',
      component: () => import('@/views/GymHome.vue'),
      meta: {
        title: 'Gym',
        requiresAuth: true,
      },
    },
    {
      path: '/gym/workouts',
      name: 'gym-workouts',
      component: () => import('@/views/GymWorkoutList.vue'),
      meta: {
        title: 'My lifts',
        requiresAuth: true,
      },
    },
    {
      path: '/gym/workouts/new',
      name: 'gym-workout-start',
      component: () => import('@/views/GymWorkoutStart.vue'),
      meta: {
        title: 'Start workout',
        requiresAuth: true,
      },
    },
    {
      path: '/gym/workouts/:id',
      name: 'gym-workout-detail',
      component: () => import('@/views/GymWorkoutDetail.vue'),
      props: true,
      meta: {
        title: 'Workout',
        requiresAuth: true,
      },
    },
    {
      path: '/gym/workouts/:id/edit',
      name: 'gym-workout-edit',
      component: () => import('@/views/GymWorkoutForm.vue'),
      props: true,
      meta: {
        title: 'Edit workout',
        requiresAuth: true,
      },
    },
    {
      path: '/gym/friends',
      name: 'gym-friends',
      component: () => import('@/views/GymActivityFeed.vue'),
      props: { feed: 'friends' },
      meta: {
        title: 'Friends',
        requiresAuth: true,
      },
    },
    {
      path: '/gym/promoted',
      name: 'gym-promoted',
      component: () => import('@/views/GymActivityFeed.vue'),
      props: { feed: 'promoted' },
      meta: {
        title: 'Promoted',
        requiresAuth: true,
      },
    },
    {
      path: '/gym/users/:id',
      name: 'gym-user-profile',
      component: () => import('@/views/GymUserProfile.vue'),
      props: true,
      meta: {
        title: 'Profile',
        requiresAuth: true,
      },
    },
    {
      path: '/401',
      name: 'unauthorized',
      component: () => import('@/views/StatusView.vue'),
      props: { code: 401 },
      meta: {
        title: 'Log in required',
      },
    },
    {
      path: '/403',
      name: 'forbidden',
      component: () => import('@/views/StatusView.vue'),
      props: { code: 403 },
      meta: {
        title: 'No access',
      },
    },
    {
      path: '/error',
      name: 'error',
      component: () => import('@/views/ErrorView.vue'),
      meta: {
        title: 'Error',
      },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/StatusView.vue'),
      props: { code: 404 },
      meta: {
        title: 'Not found',
      },
    },
  ],
});

router.beforeEach(async (to, from) => {
  if (to.meta.requiresAuth === true) {
    const authStore = useAuthStore();

    if (!authStore.isAuthenticated) {
      return {
        path: '/401',
        query: { redirect: safeBtoa(to.fullPath) },
      };
    }
  }

  return true;
});

router.afterEach((to) => {
  if (to.meta.title) {
    document.title = to.meta.title as string;
  }
});

export default router;
