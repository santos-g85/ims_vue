import { defineStore } from 'pinia'
import { ref } from 'vue'
import { FatwiseSettingService } from '@/api/FatwiseSetting'
import type { FatwiseSetting } from '@/types/FatwiseSetttings'

export const useFatRateStore = defineStore('fatRate', () => {
  const fatRates = ref<FatwiseSetting[]>([])
  const loading = ref(false)
  const loaded = ref(false)

  async function fetchFatRates(force = false) {
    if (loaded.value && !force) return
    loading.value = true
    try {
      fatRates.value = await FatwiseSettingService.getFatwiseSettings()
      loaded.value = true
    } finally {
      loading.value = false
    }
  }

  async function createFatRate(data: Partial<FatwiseSetting>) {
    loading.value = true
    try {
      const newRate = (await FatwiseSettingService.createFatwiseSetting(data)) as FatwiseSetting
      fatRates.value.push(newRate)
      return newRate
    } finally {
      loading.value = false
    }
  }

  async function updateFatRate(id: number, data: Partial<FatwiseSetting>) {
    loading.value = true
    try {
      const updated = await FatwiseSettingService.updateFatwiseSetting(id, data)
      const index = fatRates.value.findIndex((g) => g.id === id)
      if (index !== -1) {
        fatRates.value[index] = updated
      }
      return updated
    } finally {
      loading.value = false
    }
  }

  return {
    fatRates,
    loading,
    loaded,
    fetchFatRates,
    createFatRate,
    updateFatRate
  }
})

