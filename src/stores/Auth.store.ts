import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { AuthService } from '@/service/AuthService'
import type { LoginRequest, User } from '@/types/Auth'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const loading = ref(false)

  const isAuthenticated = computed(() => !user.value)

  async function login(data: LoginRequest) {
    loading.value = true
    try {
      user.value = await AuthService.login(data)
      return user.value
    } finally {
      loading.value = false
    }
  }

  async function fetchProfile() {
    loading.value = true
    try {
      user.value = await AuthService.getProfile()
    } catch {
      user.value = null
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    loading.value = true
    try {
      await AuthService.logout()
      user.value = null
    } finally {
      loading.value = false
    }
  }

  return {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    fetchProfile,
  }
})
