import { createRouter, createWebHistory } from 'vue-router'

import AdminLayout from '../layouts/AdminLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  routes: [
    {
      path: '/',
      component: AdminLayout,
      children: [
        {
          path: '',
          name: 'dashboard',
          component: () => import('../views/DashboardView.vue'),
        },

        {
          path: 'produtos',
          name: 'produtos',
          component: () => import('../views/ProductsView.vue'),
        },

        {
          path: 'pedidos',
          name: 'pedidos',
          component: () => import('../views/OrdersView.vue'),
        },
      ],
    },
  ],
})

export default router