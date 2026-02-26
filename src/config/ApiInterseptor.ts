import axios from 'axios'
import type { AxiosError, InternalAxiosRequestConfig } from 'axios'
import { ENV } from '@/env'
import { AuthService } from '@/service/AuthService'

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean
}

const api = axios.create({
  baseURL: ENV.API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

api.interceptors.request.use(
  (config) => {
    const token = document.cookie
      .split('; ')
      .find((row) => row.startsWith('A_ID='))
      ?.split('=')[1]
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    config.headers['X-Tenant-ID'] = ENV.TENANT_ID
    return config
  },
  (error) => Promise.reject(error),
)

type FailedRequest = {
  resolve: () => void
  reject: (error: AxiosError) => void
}

let isRefreshing = false
let failedQueue: FailedRequest[] = []

const processQueue = (error?: AxiosError) => {
  failedQueue.forEach(promise => {
    if (error) {
      promise.reject(error)
    } else {
      promise.resolve()
    }
  })
  failedQueue = []
}

api.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise<void>((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then(() => api(originalRequest))
      }
      originalRequest._retry = true
      isRefreshing = true
      try {
        await AuthService.refresh()
        processQueue()
        return api(originalRequest)
      } catch (err) {
        processQueue(err as AxiosError)
        return Promise.reject(err)
      } finally {
        isRefreshing = false
      }
    }
    return Promise.reject(error)
  }
)
export default api
