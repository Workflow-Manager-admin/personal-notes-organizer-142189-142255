import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Lazy load views for code split
const AuthView = () => import('@/views/AuthView.vue')
const NotesView = () => import('@/views/NotesView.vue')
const AboutView = () => import('../views/AboutView.vue')

const routes = [
  {
    path: '/auth',
    name: 'auth',
    component: AuthView,
    meta: { public: true }
  },
  {
    path: '/',
    name: 'notes',
    component: NotesView,
    meta: { requiresAuth: true }
  },
  {
    path: '/about',
    name: 'about',
    component: AboutView,
    meta: { public: true }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// Route guard for authentication
router.beforeEach((to, from, next) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    next('/auth')
  } else if (to.path === '/auth' && auth.isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

export default router
