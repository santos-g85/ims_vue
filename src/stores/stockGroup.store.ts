import { defineStore } from 'pinia'
import { ref } from 'vue'
import { StockGroupService } from '@/service/StockGroupService'
import type { StockGroup } from '@/types/StockGroup'

export const useStockGroupStore = defineStore('stockGroup', () => {
  const stockGroups = ref<StockGroup[]>([])
  const loading = ref(false)
  const loaded = ref(false)

  async function fetchStockGroups(force = false) {
    if (loaded.value && !force) return

    loading.value = true
    try {
      stockGroups.value = await StockGroupService.getStockGroups()
      loaded.value = true
    } finally {
      loading.value = false
    }
  }

  async function createStockGroup(data: Partial<StockGroup>) {
    loading.value = true
    try {
      const newGroup = await StockGroupService.createStockGroup(data)
      stockGroups.value.push(newGroup)
      return newGroup
    } finally {
      loading.value = false
    }
  }

  async function updateStockGroup(id: number, data: Partial<StockGroup>) {
    loading.value = true
    try {
      const updated = await StockGroupService.updateStockGroup(id, data)

      const index = stockGroups.value.findIndex((g) => g.id === id)
      if (index !== -1) {
        stockGroups.value[index] = updated
      }

      return updated
    } finally {
      loading.value = false
    }
  }

  async function deleteStockGroup(id: number) {
    loading.value = true
    try {
      await StockGroupService.deleteStockGroup(id)
      stockGroups.value = stockGroups.value.filter((g) => g.id !== id)
    } finally {
      loading.value = false
    }
  }

  async function deleteMultiple(ids: number[]) {
    loading.value = true
    try {
      await Promise.all(ids.map((id) => StockGroupService.deleteStockGroup(id)))
      stockGroups.value = stockGroups.value.filter((g) => !ids.includes(g.id))
    } finally {
      loading.value = false
    }
  }
  return {
    stockGroups,
    loading,
    loaded,
    fetchStockGroups,
    createStockGroup,
    updateStockGroup,
    deleteStockGroup,
    deleteMultiple,
  }
})
