
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/Fig3_HomeView.vue'
import HawkerCentrePage from '../views/HawkerCentrePage.vue';
import FoodItemPage from '../views/FoodItemPage.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/signup',
      name: 'signup',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/Fig4_SignUpView.vue')
    },
    {
      path: '/login',
      name: 'login',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/Fig5_LoginView.vue')
    },
    {
      path: '/custD',
      name: 'customerDashboard',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/Fig7_CustDashView.vue')
    },
    {
      path: '/diningOptions',
      name: 'diningOptions',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/Fig8_DiningOptionsView.vue')
    },
    {
      path: '/checkout',
      name: 'checkoutPage',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/Fig11_CheckoutView.vue')
    },
    {
      path: '/livereceipt',
      name: 'liveReceiptPage',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/Fig14_LiveReceiptView.vue')
    },
    {
      path: '/profile',
      name: 'profilePage',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/Fig6_ProfileView.vue')
    },
    {
        path: '/hawker',
        name: 'hawker',
        component: HawkerCentrePage
    },
    {
        path: '/food-item/:id/:name/:price/:stallId',
        name: 'FoodItemPage',
        component: FoodItemPage,
        props: true,
    },
    {
      path: '/payment',
      name: 'payment',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/Fig12_PaymentSuccessView.vue')
    },
    {
      path: '/seatBooking',
      name: 'seatBooking',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/Fig13_SeatBookingView.vue')
    }
  ]
})

export default router

