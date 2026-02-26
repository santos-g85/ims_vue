import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { AuthService } from '@/service/AuthService'
import type { LoginRequest, User } from '@/types/Auth'

export const useAuthStore = defineStore('auth', () => {

  const user = ref<User | null>(null)
  const loading = ref(false)
  const isAuthenticated = computed(() => !!user.value)

  async function login(data: LoginRequest) {
    loading.value = true
    try {
      await AuthService.login(data)
      await fetchProfile()
    } finally {
      loading.value = false
    }
  }

  async function fetchProfile() {
    try {
      user.value = await AuthService.getProfile()
    } catch {
      user.value = null
    }
  }

  async function logout() {
    await AuthService.logout()
    user.value = null
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
