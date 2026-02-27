<script setup lang="ts">
import { ref } from 'vue';
import { FilterMatchMode } from '@primevue/core/api';
import { useStockCategory, useStockGroups } from '@/composables/useStocks';
import type { StockCategory, StockGroup } from '@/types/Stock';

type AutoCompleteCompleteEvent = { originalEvent: Event; query: string }

const downloadFilename = "Stock_Category_" + new Date()

const {
  data: stockCategories,
  isLoading,
  createMutation,
  updateMutation,
  deleteMutation,
} = useStockCategory()

const { data: stockGroups } = useStockGroups()

const dt = ref()
const productDialog = ref(false)
const deleteProductDialog = ref(false)
const deleteProductsDialog = ref(false)
const product = ref<Partial<StockCategory>>({})
const selectedProducts = ref<StockCategory[]>([])
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
})
const submitted = ref(false)

const selectedParentGroup = ref<StockGroup | null>(null)
const filteredParentGroups = ref<StockGroup[]>([])

const selectedParentCategory = ref<StockCategory | null>(null)
const filteredParentCategories = ref<StockCategory[]>([])


const searchParentGroup = (event: AutoCompleteCompleteEvent) => {
  const query = event.query?.toLowerCase() || ''
  const groups = stockGroups.value ?? []
  filteredParentGroups.value = query
    ? groups.filter(g => g.groupName.toLowerCase().includes(query))
    : [...groups]
}

const searchParentCategory = (event: AutoCompleteCompleteEvent) => {
  const query = event.query?.toLowerCase() || ''
  const categories = (stockCategories.value ?? []).filter(
    c => c.id !== product.value.id
  )
  filteredParentCategories.value = query
    ? categories.filter(c => c.name.toLowerCase().includes(query))
    : [...categories]
}


const openNew = () => {
  product.value = {}
  selectedParentGroup.value = null
  selectedParentCategory.value = null
  submitted.value = false
  productDialog.value = true
}

const hideDialog = () => {
  productDialog.value = false
  submitted.value = false
}

const editProduct = (prod: StockCategory) => {
  product.value = { ...prod }
  selectedParentGroup.value = stockGroups.value?.find(g => g.id === prod.parentGroupId) ?? null
  selectedParentCategory.value = stockCategories.value?.find(c => c.id === prod.parentCategoryId) ?? null
  productDialog.value = true
}

async function saveProduct() {
  submitted.value = true
  if (!product.value.name?.trim()) return

  const payload: Partial<StockCategory> = {
    ...product.value,
    parentGroupId: selectedParentGroup.value?.id ?? undefined,
    parentCategoryId: selectedParentCategory.value?.id ?? undefined,
  }

  try {
    if (payload.id) {
      await updateMutation.mutateAsync({ id: payload.id, payload })
    } else {
      await createMutation.mutateAsync(payload)
    }
    hideDialog()
    product.value = {}
    selectedParentGroup.value = null
    selectedParentCategory.value = null
  } catch {
    hideDialog()
  }
}

const confirmDeleteProduct = (prod: StockCategory) => {
  product.value = prod
  deleteProductDialog.value = true
}

async function deleteProduct() {
  if (!product.value.id) return
  try {
    await deleteMutation.mutateAsync(product.value.id)
    product.value = {}
  } catch { /* toast handled in composable */ }
  finally {
    deleteProductDialog.value = false
  }
}

const confirmDeleteSelected = () => {
  deleteProductsDialog.value = true
}

async function deleteSelectedProducts() {
  if (!selectedProducts.value.length) return
  try {
    await Promise.all(selectedProducts.value.map(p => deleteMutation.mutateAsync(p.id!)))
    selectedProducts.value = []
  } catch { /* toast handled in composable */ }
  finally {
    deleteProductsDialog.value = false
  }
}

const exportCSV = () => dt.value.exportCSV()
</script>

<template>
  <div>
    <div class="card">
      <Toolbar class="mb-6">
        <template #start>
          <Button label="New" icon="pi pi-plus" class="mr-2" @click="openNew" />
          <Button
            style="margin-left: 10px;"
            label="Delete"
            icon="pi pi-trash"
            severity="danger"
            variant="outlined"
            @click="confirmDeleteSelected"
            :disabled="!selectedProducts.length"
          />
        </template>
        <template #end>
          <Button label="Export" icon="pi pi-upload" severity="secondary" @click="exportCSV" />
        </template>
      </Toolbar>

      <DataTable
        ref="dt"
        :loading="isLoading"
        v-model:selection="selectedProducts"
        :value="stockCategories"
        dataKey="id"
        :paginator="true"
        :rows="5"
        :filters="filters"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        :rowsPerPageOptions="[5, 10, 15]"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} categories"
        :exportFilename="downloadFilename"
      >
        <template #header>
          <div class="flex flex-wrap gap-2 items-center justify-between">
            <h4 class="m-0">Stock Categories</h4>
            <IconField>
              <InputIcon><i class="pi pi-search" /></InputIcon>
              <InputText v-model="filters['global'].value" placeholder="Search..." />
            </IconField>
          </div>
        </template>

        <Column selectionMode="multiple" style="width: 3rem" :exportable="false" />
        <Column header="#" style="width: 4rem">
          <template #body="{ index }">{{ index + 1 }}</template>
        </Column>
        <Column field="name" header="Name" sortable style="min-width: 10rem" />
        <Column field="aliasName" header="Alias" sortable style="min-width: 10rem" />
        <Column field="parentGroupName" header="Parent Group" sortable style="min-width: 10rem" />
        <Column field="parentCategoryName" header="Parent Category" sortable style="min-width: 10rem" />
        <Column :exportable="false" style="min-width: 12rem">
          <template #body="{ data }">
            <Button icon="pi pi-pencil" variant="outlined" rounded class="mr-2" @click="editProduct(data)" />
            <Button style="margin-left: 5px;" icon="pi pi-trash" variant="outlined" rounded severity="danger" @click="confirmDeleteProduct(data)" />
          </template>
        </Column>
      </DataTable>
    </div>

    <Dialog v-model:visible="productDialog" :style="{ width: '450px' }" header="Category Details" :modal="true">
      <div class="flex flex-col gap-6">
        <div>
          <label for="name" class="block font-bold mb-3">Name</label>
          <InputText id="name" v-model.trim="product.name" autofocus :invalid="submitted && !product.name" fluid />
          <small v-if="submitted && !product.name" class="text-red-500">Name is required.</small>
        </div>
        <div>
          <label for="aliasName" class="block font-bold mb-3">Alias Name</label>
          <InputText id="aliasName" v-model.trim="product.aliasName" fluid />
        </div>
        <div>
          <label class="block font-bold mb-3">Parent Group</label>
          <AutoComplete
            v-model="selectedParentGroup"
            optionLabel="groupName"
            :suggestions="filteredParentGroups"
            @complete="searchParentGroup"
            fluid
          >
            <template #option="{ option }">{{ option.groupName }}</template>
            <template #header>
              <div class="font-medium px-3 py-2">Available Groups</div>
            </template>
          </AutoComplete>
        </div>
        <div>
          <label class="block font-bold mb-3">Parent Category</label>
          <AutoComplete
            v-model="selectedParentCategory"
            optionLabel="name"
            :suggestions="filteredParentCategories"
            @complete="searchParentCategory"
            fluid
          >
            <template #option="{ option }">{{ option.name }}</template>
            <template #header>
              <div class="font-medium px-3 py-2">Available Categories</div>
            </template>
          </AutoComplete>
        </div>
      </div>
      <template #footer>
        <Button label="Cancel" icon="pi pi-times" text @click="hideDialog" />
        <Button
          label="Save"
          icon="pi pi-check"
          @click="saveProduct"
          :loading="createMutation.isPending.value || updateMutation.isPending.value"
        />
      </template>
    </Dialog>

    <Dialog v-model:visible="deleteProductDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
      <div class="flex items-center gap-4">
        <i class="pi pi-exclamation-triangle !text-3xl" />
        <span>Are you sure you want to delete <b>{{ product.name }}</b>?</span>
      </div>
      <template #footer>
        <Button label="No" icon="pi pi-times" text severity="secondary" @click="deleteProductDialog = false" />
        <Button label="Yes" icon="pi pi-check" severity="danger" :loading="deleteMutation.isPending.value" @click="deleteProduct" />
      </template>
    </Dialog>

    <Dialog v-model:visible="deleteProductsDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
      <div class="flex items-center gap-4">
        <i class="pi pi-exclamation-triangle !text-3xl" />
        <span>Are you sure you want to delete {{ selectedProducts.length }} selected categories?</span>
      </div>
      <template #footer>
        <Button label="No" icon="pi pi-times" text severity="secondary" @click="deleteProductsDialog = false" />
        <Button label="Yes" icon="pi pi-check" text severity="danger" :loading="deleteMutation.isPending.value" @click="deleteSelectedProducts" />
      </template>
    </Dialog>
  </div>
</template>
