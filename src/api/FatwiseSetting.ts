import api from '@/api/ApiInterseptor'
import type { FatwiseSetting } from '@/types/FatwiseSetttings'

const baseUrl : string = '/ims/v1'

export const FatwiseSettingService = {
  async getFatwiseSettings(): Promise<FatwiseSetting[]> {
    const response = await api.get<FatwiseSetting[]>(`${baseUrl}/fat-rate`)
    return response.data
  },

  async createFatwiseSetting(data: Partial<FatwiseSetting>): Promise<FatwiseSetting> {
    const response = await api.post<FatwiseSetting>(`${baseUrl}/fat-rate`, data)
    return response.data
  },

  async updateFatwiseSetting(id: number, data: Partial<FatwiseSetting>): Promise<FatwiseSetting> {
    const response = await api.put<FatwiseSetting>(`${baseUrl}/fat-rate/${id}`, data)
    return response.data
  },

  async deleteFatwiseSetting(trnDate: Date): Promise<void> {
    await api.delete(`${baseUrl}/fat-rate/${trnDate}`)
  },
}
