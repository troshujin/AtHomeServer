import { createRouter, createWebHistory } from 'vue-router'

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
      path: '/gym',
      name: 'gym',
      component: () => import('@/views/GymHome.vue'),
      meta: {
        title: 'Gym',
      },
    },
    {
      path: '/gym/workouts/new',
      name: 'gym-workout-new',
      component: () => import('@/views/GymWorkoutForm.vue'),
      meta: {
        title: 'New workout',
      },
    },
    {
      path: '/gym/workouts/:id',
      name: 'gym-workout-detail',
      component: () => import('@/views/GymWorkoutDetail.vue'),
      props: true,
      meta: {
        title: 'Workout',
      },
    },
    {
      path: '/gym/workouts/:id/edit',
      name: 'gym-workout-edit',
      component: () => import('@/views/GymWorkoutForm.vue'),
      props: true,
      meta: {
        title: 'Edit workout',
      },
    },
  ],
})

router.beforeEach(async (to, from, next) => {
  next()
})

router.afterEach((to) => {
  if (to.meta.title) {
    document.title = to.meta.title as string
  }
})

export default router
