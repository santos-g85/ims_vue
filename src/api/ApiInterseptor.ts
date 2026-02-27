import axios from 'axios'
import type { AxiosError, InternalAxiosRequestConfig } from 'axios'
import { ENV } from '@/env'
import { AuthService } from '@/api/AuthService'

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean
}

type FailedRequest = {
  resolve: () => void
  reject: (error: AxiosError) => void
}

const COOKIE_TOKEN_KEY = 'A_ID'
const AUTH_HEADER = 'Authorization'
const TENANT_HEADER = 'X-Tenant-ID'
const AUTH_ENDPOINTS = ['/auth/login', '/auth/refresh']

const getTokenFromCookie = (): string | null => {
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${COOKIE_TOKEN_KEY}=([^;]*)`)
  )
  return match && match[1] ? decodeURIComponent(match[1]) : null
}

const api = axios.create({
  baseURL: ENV.API_URL,
  withCredentials: true,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

api.interceptors.request.use(
  (config) => {
    const token = getTokenFromCookie()
    if (token) {
      config.headers[AUTH_HEADER] = `Bearer ${token}`
    }
    config.headers[TENANT_HEADER] = ENV.TENANT_ID
    return config
  },
  (error) => Promise.reject(error),
)

let isRefreshing = false
let failedQueue: FailedRequest[] = []

const processQueue = (error?: AxiosError) => {
  failedQueue.forEach((promise) => {
    void (error ? promise.reject(error) : promise.resolve())
  })
  failedQueue = []
}

api.interceptors.response.use(
 (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig | undefined
    if (
      !originalRequest ||
      error.response?.status !== 401 ||
      originalRequest._retry ||
      AUTH_ENDPOINTS.some((path) => originalRequest.url?.includes(path))
    ) {
      return Promise.reject(error)
    }

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
      const axiosErr = axios.isAxiosError(err)
        ? err
        : new axios.AxiosError(String(err))
      processQueue(axiosErr)
      return Promise.reject(axiosErr)
    } finally {
      isRefreshing = false
    }
  },
)

export default api
