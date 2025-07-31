import { defineStore } from 'pinia'
import { ref } from 'vue'
import * as api from '@/api/api'

interface AuthUser {
  username: string
  email?: string
  // Add ids or other fields as needed
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<AuthUser | null>(null)
  const isAuthenticated = ref<boolean>(false)
  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)

  // PUBLIC_INTERFACE
  async function login(username: string, password: string) {
    loading.value = true
    error.value = null
    try {
      const res = await api.login(username, password)
      user.value = res.data.user || res.data as AuthUser
      isAuthenticated.value = true
    } catch (e) {
      // Try to infer error message from backend
      if (e && typeof e === 'object' && 'response' in e && e.response?.data?.detail) {
        error.value = e.response.data.detail
      } else {
        error.value = 'Invalid credentials'
      }
      isAuthenticated.value = false
    }
    loading.value = false
  }

  // PUBLIC_INTERFACE
  async function register(username: string, email: string, password: string) {
    loading.value = true
    error.value = null
    try {
      const res = await api.register(username, email, password)
      user.value = res.data.user || res.data as AuthUser
      isAuthenticated.value = true
    } catch (e) {
      if (e && typeof e === 'object' && 'response' in e && e.response?.data?.detail) {
        error.value = e.response.data.detail
      } else {
        error.value = 'Registration failed'
      }
      isAuthenticated.value = false
    }
    loading.value = false
  }

  // PUBLIC_INTERFACE
  async function logout() {
    await api.logout()
    user.value = null
    isAuthenticated.value = false
  }

  return { user, isAuthenticated, loading, error, login, logout, register }
})
