import type { StockCategory, StockGroup, StockGroupCreate } from '@/types/Stock'
import api from '../config/ApiInterseptor'
const baseUrl : string = '/ims/v1'
export const StockGroupService = {
  async getStockGroups(): Promise<StockGroup[]> {
    const response = await api.get<StockGroup[]>(`${baseUrl}/stock-groups`)
    return response.data
  },

  async createStockGroup(data: Partial<StockGroupCreate>): Promise<StockGroupCreate> {
    const response = await api.post<StockGroupCreate>(`${baseUrl}/stock-groups`, data)
    return response.data
  },

  async updateStockGroup(id: number, data: Partial<StockGroup>): Promise<StockGroup> {
    const response = await api.put<StockGroup>(`${baseUrl}/stock-groups/${id}`, data)
    return response.data
  },

  async deleteStockGroup(id: number): Promise<void> {
    await api.delete(`${baseUrl}/stock-groups/${id}`)
  },
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
