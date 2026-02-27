import type { LoginRequest, User } from '@/types/Auth'
import api from './ApiInterseptor'
const baseUrl : string = '/ims/v1'

export const AuthService = {

  async login(data: LoginRequest){
    const response = await api.post<User>(`${baseUrl}/auth/login`, data)
    return response.data;
  },

  async refresh(): Promise<void> {
    await api.post(`${baseUrl}/auth/refresh`)
  },

  async logout(): Promise<void> {
    await api.post(`${baseUrl}/auth/logout`)
  },

  async getProfile(): Promise<User> {
    const response = await api.get<User>(`${baseUrl}/auth/me`)
    return response.data
  },
}
