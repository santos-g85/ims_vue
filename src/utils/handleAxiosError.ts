import type { AxiosError } from 'axios'

export function getErrorMessage(error: unknown): string {
  if (error && (error as AxiosError).isAxiosError) {
    const axiosErr = error as AxiosError
    const data = axiosErr.response?.data as { detail?: string } | undefined
    if (data?.detail) {
      return data.detail
    } else if (axiosErr.message) {
      return axiosErr.message
    }
  } else if (error instanceof Error) {
    return error.message
  }
  return 'Operation failed'
}
