import { defineStore } from 'pinia'
import { ref } from 'vue'
import { StockCategoryService, StockGroupService } from '@/api/StockService'
import type { StockGroup, StockCategory } from '@/types/Stock'

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
      const newGroup = (await StockGroupService.createStockGroup(data)) as StockGroup
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

export const useStockCategoryStore = defineStore('stockCategory', () => {

  const stockCategories = ref<StockCategory[]>([])
  const loading = ref(false)
  const loaded = ref(false)

  async function fetchStockCategories(force = false) {
    if (loaded.value && !force) return
    loading.value = true
    try {
      stockCategories.value = await StockCategoryService.getStockCategories()
      loaded.value = true
    } finally {
      loading.value = false
    }
  }

  async function createStockCategory(data: Partial<StockCategory>) {
    loading.value = true
    try {
      const newCategory = (await StockCategoryService.createStockCategory(data)) as StockCategory
      stockCategories.value.push(newCategory)
      return newCategory
    } finally {
      loading.value = false
    }
  }

  async function updateStockCategory(id: number, data: Partial<StockCategory>) {
    loading.value = true
    try {
      const updated = await StockCategoryService.updateStockCategory(id, data)

      const index = stockCategories.value.findIndex((c) => c.id === id)
      if (index !== -1) {
        stockCategories.value[index] = updated
      }

      return updated
    } finally {
      loading.value = false
    }
  }

  async function deleteStockCategory(id: number) {
    loading.value = true
    try {
      await StockCategoryService.deleteStockCategory(id)
      stockCategories.value = stockCategories.value.filter((c) => c.id !== id)
    } finally {
      loading.value = false
    }
  }

  async function deleteMultiple(ids: number[]) {
    loading.value = true
    try {
      await Promise.all(ids.map((id) => StockCategoryService.deleteStockCategory(id)))
      stockCategories.value = stockCategories.value.filter((c) => !ids.includes(c.id))
    } finally {
      loading.value = false
    }
  }

  return {
    stockCategories,
    loading,
    loaded,
    fetchStockCategories,
    createStockCategory,
    updateStockCategory,
    deleteStockCategory,
    deleteMultiple,
  }
})
