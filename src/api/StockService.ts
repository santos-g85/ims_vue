import type { StockCategory, StockGroup} from '@/types/Stock'
import api from './ApiInterseptor'
const baseUrl : string = '/ims/v1'

export const StockGroupService =
{
   fetchAll: async (): Promise<StockGroup[]> => {
    const { data } = await api.get(`${baseUrl}/stock-groups`)
    return data
  },
  create: async (payload: Partial<StockGroup>) => {
   const { data } = await api.post(`${baseUrl}/stock-groups`, payload)
   return data
  },
  update: async (id: number, payload: Partial<StockGroup>) => {
    await api.put(`${baseUrl}/stock-groups/${id}`, payload)
  },

  delete: async (id: number) => {
    await api.delete(`${baseUrl}/stock-groups/${id}`)
  }
}

export const StockCategoryService = {
  fetchAll: async (): Promise<StockCategory[]> => {
    const { data } = await api.get(`${baseUrl}/stock-categories`)
    return data
  },

  create: async (payload: Partial<StockCategory>) => {
   const { data } = await api.post(`${baseUrl}/stock-categories`, payload)
   return data
  },

  update: async (id: number, payload: Partial<StockCategory>) => {
    await api.put(`${baseUrl}/stock-categories/${id}`, payload)
  },

  delete: async (id: number) => {
    await api.delete(`${baseUrl}/stock-categories/${id}`)
  }
}
