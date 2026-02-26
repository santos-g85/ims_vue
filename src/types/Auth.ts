export interface LoginRequest {
  email: string
  password: string
}

export interface AuthResponse {
  accessToken: string
  RefreshToken: string
}
export interface User {
  id: number
  username: string
  email: string
  role: string
  enabled: boolean
  createdAt: string
}
