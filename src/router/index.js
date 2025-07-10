import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import Home from '../views/Home.vue'

const router = createRouter({
	history: createWebHistory(),
	routes: [
		{
			path: '/',
			component: Home
		},
        {
            path: '/akun', component: () => import('@/views/Akun.vue'), meta: { requiresAuth: true }
        },
        {
            path: '/keranjang/checkout',
            component: () => import('../views/checkout.vue')
        },
        {
            path: '/search',
            component: () => import('../views/Search.vue')
        },
        {
            path: '/produk',
            component: () => import('../views/produk.vue')
        },
                {
            path: '/keranjang',
            component: () => import('../views/Keranjang.vue')
        },
                {
            path: '/login',
            component: () => import('../views/login.vue')
        },
                {
            path: '/register',
            component: () => import('../views/register.vue')
        },
                {
            path: '/riwayat-transaksi',
            component: () => import('../views/riwayat-transaksi.vue')
        },
        {
            path: '/settings',
            component: () => import('../views/settings.vue'),
            meta: { requiresAuth: true }
        },
        {
            path: '/contact',
            component: () => import('../views/contact.vue')
        },
         {
            path: '/keranjang/checkout/konfirmasi-order',
            component: () => import('../views/konfirmasi-order.vue')
        },
        {
            path: '/databarang',
            component: () => import('../views/Databarang.vue')
        },
	],
})

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  
  if (to.meta.requiresAuth && !userStore.isAuthenticated) {
    next('/login')
  } else {
    next()
  }
})


export default router