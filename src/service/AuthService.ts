import type { LoginRequest, User } from '@/types/Auth'
import api from '../config/ApiInterseptor'

export const AuthService = {
  async login(data: LoginRequest): Promise<User> {
    const response = await api.post<User>('/api/v1/auth/login', data)
    return response.data
  },

  async refresh(): Promise<void> {
    await api.post('/api/v1/auth/refresh')
  },

  async logout(): Promise<void> {
    await api.post('/api/v1/auth/logout')
  },

  async getProfile(): Promise<User> {
    const response = await api.get<User>('/api/v1/auth/me')
    return response.data
  },
}
