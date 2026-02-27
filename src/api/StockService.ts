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

  async getStockCategories(): Promise<StockCategory[]> {
    const response = await api.get<StockCategory[]>(`${baseUrl}/stock-categories`)
    return response.data
  },

  async createStockCategory(data: Partial<StockCategory>): Promise<StockCategory> {
    const response = await api.post<StockCategory>(`${baseUrl}/stock-categories`, data)
    return response.data
  },

  async updateStockCategory(id: number, data: Partial<StockCategory>): Promise<StockCategory> {
    const response = await api.put<StockCategory>(`${baseUrl}/stock-categories/${id}`, data)
    return response.data
  },

  async deleteStockCategory(id: number): Promise<void> {
    await api.delete(`${baseUrl}/stock-categories/${id}`)
  },
}
