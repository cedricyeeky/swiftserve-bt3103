import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/Fig3_HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/Fig4_LoginView.vue')
    },
    {
      path: '/custD',
      name: 'customerDashboard',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/Fig7_CustDashView.vue')
    }
  ]
})

export default router
