import { useToast } from 'primevue/usetoast'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { AuthService } from '@/api/AuthService'
import type { LoginRequest } from '@/types/Auth'

export function useAuth() {
  const toast = useToast()
  const queryClient = useQueryClient()

  const loginMutation = useMutation({
    mutationFn: (data: LoginRequest) => AuthService.login(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['me'] })
      toast.add({ severity: 'success', summary: 'Login successful', detail: 'You have been logged in.', life: 3000 })
    },
    onError: () => {
    toast.add({ severity: 'error', summary: 'Login failed', detail: 'Invalid credentials.', life: 3000 })
    },
  })

  return {
    loginMutation,
    isLoading: loginMutation.isPending,
  }
}
