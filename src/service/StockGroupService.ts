import type { StockGroup, StockGroupCreate } from '@/types/StockGroup'
import api from '../config/ApiInterseptor'

export const StockGroupService = {
  async getStockGroups(): Promise<StockGroup[]> {
    const response = await api.get<StockGroup[]>('/api/v1/stock-groups')
    return response.data
  },

  async createStockGroup(data: Partial<StockGroupCreate>): Promise<StockGroupCreate> {
    const response = await api.post<StockGroupCreate>('/api/v1/stock-groups', data)
    return response.data
  },

  async updateStockGroup(id: number, data: Partial<StockGroup>): Promise<StockGroup> {
    const response = await api.put<StockGroup>(`/api/v1/stock-groups/${id}`, data)
    return response.data
  },

  async deleteStockGroup(id: number): Promise<void> {
    await api.delete(`/api/v1/stock-groups/${id}`)
  },
}
