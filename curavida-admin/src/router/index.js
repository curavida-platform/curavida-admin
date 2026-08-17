import { createRouter, createWebHistory } from 'vue-router'

import AdminLayout from '../layouts/AdminLayout.vue'
import CategoriesView from '../views/CategoriesView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: {
        guest: true,
      },
    },

    {
      path: '/',
      component: AdminLayout,

      meta: {
        requiresAuth: true,
      },

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

        {
          path: 'categorias',
          name: 'categorias',
          component: CategoriesView,
        },
      ],
    },
  ],
})

router.beforeEach((to) => {
  const token = localStorage.getItem(
    'curavida-admin-token',
  )

  if (to.meta.requiresAuth && !token) {
    return {
      name: 'login',
    }
  }

  if (to.meta.guest && token) {
    return {
      name: 'dashboard',
    }
  }
})

export default router