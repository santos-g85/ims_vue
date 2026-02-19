import axios from 'axios'
import { ENV } from '@/env'

const api = axios.create({
  baseURL: ENV.API_URL,
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
export default api
