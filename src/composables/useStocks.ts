import { StockGroupService, StockCategoryService } from '@/api/StockService'
import type { StockCategory, StockGroup } from '@/types/Stock'
import { useQueryClient, useQuery, useMutation } from '@tanstack/vue-query'
import { useToast } from 'primevue/usetoast'
import { getErrorMessage } from '@/utils/handleAxiosError'

export function useStockGroups() {
  const queryClient = useQueryClient()
  const toast = useToast()

  const query = useQuery<StockGroup[]>({
    queryKey: ['stock-groups'],
    queryFn: StockGroupService.fetchAll,
    staleTime: Infinity,
  })

  const createMutation = useMutation({
    mutationFn: StockGroupService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stock-groups'] })
      toast.add({
        severity: 'success',
        summary: 'Group Created',
        detail: 'Group created successfully',
        life: 3000,
      })
    },
    onError: (error: unknown) => {
      const message = getErrorMessage(error)
      toast.add({ severity: 'error', summary: 'cannot create', detail: message, life: 3000 })
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Partial<StockGroup> }) =>
      StockGroupService.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stock-groups'] })
      toast.add({
        severity: 'success',
        summary: 'Updated',
        detail: 'Group update successfully',
        life: 3000,
      })
    },
    onError: (error: unknown) => {
      const message = getErrorMessage(error)
      toast.add({ severity: 'error', summary: 'cannot update', detail: message, life: 3000 })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => StockGroupService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stock-groups'] })
      toast.add({
        severity: 'success',
        summary: 'Deleted',
        detail: 'Group deleted successfully',
        life: 3000,
      })
    },
    onError: (error: unknown) => {
      const message = getErrorMessage(error)
      toast.add({ severity: 'error', summary: 'Cannot delete', detail: message, life: 3000 })
    },
  })
  return {
    ...query,
    createMutation,
    updateMutation,
    deleteMutation,
  }
}

export function useStockCategory() {
  const queryClient = useQueryClient()
  const toast = useToast()

  const query = useQuery<StockCategory[]>({
    queryKey: ['stock-categories'],
    queryFn: StockCategoryService.fetchAll,
    staleTime: Infinity,
  })

  const createMutation = useMutation({
    mutationFn: StockCategoryService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stock-categories'] })
      toast.add({
        severity: 'success',
        summary: 'Category Created',
        detail: 'Category created successfully',
        life: 3000,
      })
    },
    onError: (error: unknown) => {
      const message = getErrorMessage(error)
      toast.add({ severity: 'error', summary: 'cannot create', detail: message, life: 3000 })
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Partial<StockGroup> }) =>
      StockCategoryService.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stock-categories'] })
      toast.add({
        severity: 'success',
        summary: 'Updated',
        detail: 'Category update successfully',
        life: 3000,
      })
    },
    onError: (error: unknown) => {
      const message = getErrorMessage(error)
      toast.add({ severity: 'error', summary: 'cannot update', detail: message, life: 3000 })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => StockCategoryService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stock-categories'] })
      toast.add({
        severity: 'success',
        summary: 'Deleted',
        detail: 'Category deleted successfully',
        life: 3000,
      })
    },
    onError: (error: unknown) => {
      const message = getErrorMessage(error)
      toast.add({ severity: 'error', summary: 'Cannot delete', detail: message, life: 3000 })
    },
  })
  return {
    ...query,
    createMutation,
    updateMutation,
    deleteMutation,
  }
}
