<script setup lang="ts">
import { useStockGroupStore } from '@/stores/stockGroup.store'
import { computed, onMounted, ref } from 'vue'
import { FilterMatchMode } from '@primevue/core/api'
import { useToast } from 'primevue/usetoast'
import type { StockGroup } from '@/types/StockGroup'

const stockGroupStore = useStockGroupStore()
onMounted(() => {
  stockGroupStore.fetchStockGroups()
})

const toast = useToast()
const dt = ref()
const productDialog = ref(false)
const deleteProductDialog = ref(false)
const deleteProductsDialog = ref(false)

const product = ref<Partial<StockGroup>>({})
const selectedProducts = ref<StockGroup[]>([])

const filters = ref({ global: { value: null, matchMode: FilterMatchMode.CONTAINS } })
const submitted = ref(false)

const parentGroupOptions = computed(() => {
  return stockGroupStore.stockGroups
    ?.filter((group) => !product.value.id || group.id !== product.value.id)
    .map((group) => ({
      label: group.groupName,
      value: group.id,
    }))
})

function openNew() {
  product.value = {}
  submitted.value = false
  productDialog.value = true
}

function hideDialog() {
  productDialog.value = false
  submitted.value = false
}

async function saveProduct() {
  submitted.value = true

  // Use groupName consistently
  if (!product.value.groupName?.trim()) return

  try {
    if (product.value.id) {
      // TypeScript now knows .id exists because product is Partial<StockGroup>
      await stockGroupStore.updateStockGroup(product.value.id, product.value as StockGroup)
      toast.add({ severity: 'success', summary: 'Success', detail: 'Group Updated', life: 3000 })
    } else {
      await stockGroupStore.createStockGroup(product.value)
      toast.add({ severity: 'success', summary: 'Success', detail: 'Group Created', life: 3000 })
    }

    productDialog.value = false
    product.value = {}
  } catch {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Operation failed', life: 3000 })
  }
}

function editProduct(prod: StockGroup) {
  product.value = { ...prod }
  productDialog.value = true
}

function confirmDeleteProduct(prod: StockGroup) {
  product.value = prod
  deleteProductDialog.value = true
}

async function deleteProduct() {
  if (product.value.id !== undefined) {
    await stockGroupStore.deleteStockGroup(product.value.id)
    deleteProductDialog.value = false
    product.value = {}
    toast.add({ severity: 'success', summary: 'Success', detail: 'Group Deleted', life: 3000 })
  }
}

function exportCSV() {
  dt.value.exportCSV()
}

function confirmDeleteSelected() {
  deleteProductsDialog.value = true
}

async function deleteSelectedProducts() {
  const ids = selectedProducts.value.map((p) => p.id)

  await stockGroupStore.deleteMultiple(ids)

  deleteProductsDialog.value = false
  selectedProducts.value = []

  toast.add({ severity: 'success', summary: 'Success', detail: 'Groups Deleted', life: 3000 })
}
</script>

<template>
  <div>
    <div class="card">
      <Toolbar class="mb-6">
        <template #start>
          <Button
            label="New"
            icon="pi pi-plus"
            severity="secondary"
            class="mr-2"
            @click="openNew"
          />
          <Button
            label="Delete"
            icon="pi pi-trash"
            severity="secondary"
            @click="confirmDeleteSelected"
            :disabled="!selectedProducts || !selectedProducts.length"
          />
        </template>

        <template #end>
          <Button label="Export" icon="pi pi-upload" severity="secondary" @click="exportCSV()" />
        </template>
      </Toolbar>

      <DataTable
        ref="dt"
        :value="stockGroupStore.stockGroups"
        v-model:selection="selectedProducts"
        :loading="stockGroupStore.loading"
        dataKey="id"
        :paginator="true"
        :rows="10"
        :filters="filters"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        :rowsPerPageOptions="[5, 10, 15]"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} groups"
      >
        <template #header>
          <div class="flex flex-wrap gap-2 items-center justify-between">
            <h4 class="m-0">Stock Group</h4>
            <IconField>
              <InputIcon>
                <i class="pi pi-search" />
              </InputIcon>
              <InputText v-model="filters['global'].value" placeholder="Search..." />
            </IconField>
          </div>
        </template>
        <Column selectionMode="multiple" style="width: 3rem" :exportable="false"></Column>
        <Column header="#" style="width: 4rem">
          <template #body="slotProps">
            {{ slotProps.index + 1 }}
          </template>
        </Column>
        <Column field="groupName" header="Group Name" sortable style="min-width: 10rem"></Column>
        <Column
          field="parentGroupName"
          header="Parent Group"
          sortable
          style="min-width: 10rem"
        ></Column>
        <Column :exportable="false" style="min-width: 12rem">
          <template #body="slotProps">
            <Button
              icon="pi pi-pencil"
              outlined
              rounded
              class="mr-2"
              @click="editProduct(slotProps.data)"
            />
            <Button
              icon="pi pi-trash"
              outlined
              rounded
              severity="danger"
              @click="confirmDeleteProduct(slotProps.data)"
            />
          </template>
        </Column>
      </DataTable>
    </div>

    <Dialog
      v-model:visible="productDialog"
      :style="{ width: '450px' }"
      header="Stock Group Details"
      :modal="true"
    >
      <div class="flex flex-col gap-6">
        <div>
          <label for="name" class="block font-bold mb-3">Name</label>
          <InputText
            id="name"
            v-model.trim="product.groupName"
            required="true"
            autofocus
            :invalid="submitted && !product.groupName"
            fluid
          />
          <small v-if="submitted && !product.groupName" class="text-red-500"
            >Name is required.</small
          >
        </div>
        <div>
          <label for="parentGroup" class="block font-bold mb-3">Parent Group</label>
          <Select
            id="parentGroup"
            v-model="product.parentGroupId"
            :options="parentGroupOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="Select Parent Group"
            fluid
          />
        </div>
      </div>
      <template #footer>
        <Button label="Cancel" icon="pi pi-times" text @click="hideDialog" />
        <Button label="Save" icon="pi pi-check" @click="saveProduct" />
      </template>
    </Dialog>

    <Dialog
      v-model:visible="deleteProductDialog"
      :style="{ width: '450px' }"
      header="Confirm"
      :modal="true"
    >
      <div class="flex items-center gap-4">
        <i class="pi pi-exclamation-triangle !text-3xl" />
        <span v-if="product"
          >Are you sure you want to delete <b>{{ product.groupName }}</b
          >?</span
        >
      </div>
      <template #footer>
        <Button label="No" icon="pi pi-times" text @click="deleteProductDialog = false" />
        <Button label="Yes" icon="pi pi-check" @click="deleteProduct" />
      </template>
    </Dialog>

    <Dialog
      v-model:visible="deleteProductsDialog"
      :style="{ width: '450px' }"
      header="Confirm"
      :modal="true"
    >
      <div class="flex items-center gap-4">
        <i class="pi pi-exclamation-triangle !text-3xl" />
        <span v-if="product">Are you sure you want to delete the selected products?</span>
      </div>
      <template #footer>
        <Button label="No" icon="pi pi-times" text @click="deleteProductsDialog = false" />
        <Button label="Yes" icon="pi pi-check" text @click="deleteSelectedProducts" />
      </template>
    </Dialog>
  </div>
</template>
