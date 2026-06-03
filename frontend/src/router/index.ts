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
