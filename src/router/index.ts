import AppLayout from '@/layout/AppLayout.vue'
import { createRouter, createWebHistory } from 'vue-router'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/auth/login',
    },
    {
      path: '/dashboard',
      component: AppLayout,
      children: [{ path: '', name: 'dashboard', component: () => import('@/views/HomeView.vue') }],
    },
    {
      path: '/charts-of-accounts',
      component: AppLayout,
      children: [{ path: '', name: 'charts-of-accounts', component: () => import('@/views/accounts/ChartOfAccounts.vue') }],
    },
    {
      path: '/inventory',
      component: AppLayout,
      children: [
        {
          path: '',
          name: 'inventory',
          component: () => import('@/views/Inventory/StockItems.vue'),
        },
        {
          path: 'stock-group',
          name: 'stock-group',
          component: () => import('@/views/Inventory/StockGroup.vue'),
        },
        {
          path: 'stock-category',
          name: 'stock-category',
          component: () => import('@/views/Inventory/StockCategory.vue'),
        },
        {
          path: 'stock-item',
          name: 'stock-item',
          component: () => import('@/views/Inventory/StockItems.vue'),
        },
        {
          path: 'fatwise-settings',
          name: 'fatwise-settings',
          component: () => import('@/views/Inventory/FatwiseSettings.vue'),
        },
        {
          path: 'bom-list',
          name: 'bom-list',
          component: () => import('@/views/Inventory/BOMList.vue'),
        },
      ],
    },
    {
      path: '/auth',
      children: [
        {
          path: '',
          redirect: '/auth/login',
        },
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
