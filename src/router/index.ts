import AppLayout from '@/layout/AppLayout.vue'
import { createRouter, createWebHistory } from 'vue-router'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: AppLayout,
      children: [{ path: '/', name: 'dashboard', component: () => import('@/views/HomeView.vue') }],
    },
    {
      path: '/inventory',
      component: AppLayout,
      children: [
        {
          path: 'stock-group',
          name: 'stock-group',
          component: () => import('@/views/Inventory/StockGroup.vue'),
        },
      ],
    },
    {
      path: '/auth',
      children: [
        {
          path: 'login',
          name: 'Sign In',
          component: () => import('@/views/auth/LoginView.vue'),
        },
      ],
    },
  ],
})

export default router
