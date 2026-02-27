<script setup lang="ts">
import { ref, watch } from "vue"
import type { StockGroup } from "@/types/Stock"
import { useStockGroups } from "@/composables/useStocks"

type AutoCompleteCompleteEvent = { originalEvent: Event; query: string }

const dt = ref()
const productDialog = ref(false)
const deleteProductDialog = ref(false)
const deleteProductsDialog = ref(false)

const product = ref<Partial<StockGroup>>({})
const selectedProducts = ref<StockGroup[]>([])

const selectedParentGroup = ref<StockGroup | null>(null)
const filteredParentGroups = ref<StockGroup[]>([])

const filters = ref({ global: { value: null, matchMode: "contains" } })
const submitted = ref(false)

const {
  data: stockGroups,
  isLoading,
  createMutation,
  updateMutation,
  deleteMutation
} = useStockGroups()

watch(stockGroups, (groups) => {
  filteredParentGroups.value = groups || []
})

function openNew() {
  product.value = {}
  submitted.value = false
  selectedParentGroup.value = null
  filteredParentGroups.value = stockGroups.value || []
  productDialog.value = true
}

function hideDialog() {
  productDialog.value = false
  submitted.value = false
}

async function saveProduct() {
  submitted.value = true
  if (!product.value.groupName?.trim()) return

  try {
    if (product.value.id) {
      await updateMutation.mutateAsync({ id: product.value.id, payload: product.value })
    } else {
      await createMutation.mutateAsync(product.value)
    }
    hideDialog()
    product.value = {}
  } catch {
    hideDialog()
  }
}

// Edit
function editProduct(prod: StockGroup) {
  product.value = { ...prod }
  selectedParentGroup.value = stockGroups.value?.find(g => g.id === prod.parentGroupId) || null
  filteredParentGroups.value = stockGroups.value?.filter(g => g.id !== prod.id) || []
  productDialog.value = true
}

// Delete single
function confirmDeleteProduct(prod: StockGroup) {
  product.value = prod
  deleteProductDialog.value = true
}

async function deleteProduct() {
  if (!product.value.id) return
  try {
    await deleteMutation.mutateAsync(product.value.id)
    deleteProductDialog.value = false
    product.value = {}
  } catch{
   deleteProductDialog.value =false
  }
}


function confirmDeleteSelected() {
  deleteProductsDialog.value = true
}

async function deleteSelectedProducts() {
  if (!selectedProducts.value.length) return
  try {
    await Promise.all(selectedProducts.value.map(p => deleteMutation.mutateAsync(p.id!)))
    deleteProductsDialog.value = false
    selectedProducts.value = []
  } catch  {
    deleteProductsDialog.value= false
  }
}

// AutoComplete search
const searchParentGroup = (event: AutoCompleteCompleteEvent) => {
  const query = event.query?.toLowerCase() || ""
  let groups = stockGroups.value || []
  if (product.value.id) groups = groups.filter(g => g.id !== product.value.id)
  filteredParentGroups.value = query
    ? groups.filter(g => g.groupName.toLowerCase().includes(query))
    : groups
}

// Sync parent group selection
watch(selectedParentGroup, (val) => {
  product.value.parentGroupId = val?.id ?? null
})

</script>

<template>
  <div>
    <div class="card">
      <Toolbar class="mb-6">
        <template #start>
          <Button label="New" icon="pi pi-plus" class="mr-2" @click="openNew" />
          <Button label="Delete" icon="pi pi-trash" severity="danger" variant="outlined" @click="confirmDeleteSelected"
            style="margin-left: 10px" :disabled="!selectedProducts.length" />
        </template>
        <template #end>
          <Button label="Export" icon="pi pi-upload" severity="secondary" @click="dt.exportCSV()" />
        </template>
      </Toolbar>

      <DataTable ref="dt" v-model:selection="selectedProducts" :value="stockGroups" :loading="isLoading" dataKey="id"
        :paginator="true" :rows="10" :filters="filters"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        :rowsPerPageOptions="[5, 10, 15]" currentPageReportTemplate="Showing {first} to {last} of {totalRecords} groups">
        <template #header>
          <div class="flex flex-wrap gap-2 items-center justify-between">
            <h4 class="m-0">Stock Groups</h4>
            <IconField>
              <InputIcon><i class="pi pi-search" /></InputIcon>
              <InputText v-model="filters['global'].value" placeholder="Search..." />
            </IconField>
          </div>
        </template>

        <Column selectionMode="multiple" style="width:3rem" :exportable="false" />
        <Column header="#" style="width:4rem">
          <template #body="slotProps">{{ slotProps.index + 1 }}</template>
        </Column>
        <Column field="groupName" header="Group Name" sortable style="min-width:10rem" />
        <Column field="parentGroupName" header="Parent Group" sortable style="min-width:10rem" />
        <Column :exportable="false" style="min-width:12rem">
          <template #body="slotProps">
            <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editProduct(slotProps.data)" />
            <Button style="margin-left:5px;" icon="pi pi-trash" outlined rounded severity="danger"
              @click="confirmDeleteProduct(slotProps.data)" />
          </template>
        </Column>
      </DataTable>
    </div>

    <!-- Add / Edit Dialog -->
    <Dialog
      :loading="createMutation.isPending || updateMutation.isPending"
      v-model:visible="productDialog" :style="{ width: '450px' }" header="Stock Group Details" :modal="true">
      <div class="flex flex-col gap-6">
        <div>
          <label for="name" class="block font-bold mb-3">Name</label>
          <InputText id="name" v-model.trim="product.groupName" :invalid="submitted && !product.groupName" autofocus
            fluid />
          <small v-if="submitted && !product.groupName" class="text-red-500">Name is required.</small>
        </div>

        <div>
          <label for="parentGroup" class="block font-bold mb-3">Parent Group</label>
          <AutoComplete v-model="selectedParentGroup" optionLabel="groupName" :suggestions="filteredParentGroups"
            @complete="searchParentGroup">
            <template #option="{ option }">
              <div class="flex items-center">{{ option.groupName }}</div>
            </template>
            <template #header>
              <div class="font-medium px-3 py-2">Available Groups</div>
            </template>
            <template #footer>
              <div class="px-3 py-3">
                <Button label="Add New" fluid severity="secondary" text size="small" icon="pi pi-plus"
                  @click="hideDialog" />
              </div>
            </template>
          </AutoComplete>
        </div>
      </div>

      <template #footer>
        <Button label="Cancel" icon="pi pi-times" text @click="hideDialog" />
        <Button label="Save" icon="pi pi-check" :loading="createMutation.isPending.value || updateMutation.isPending.value" @click="saveProduct" />
      </template>
    </Dialog>

    <!-- Delete Single Dialog -->
    <Dialog :loading = "deleteMutation.isPending" v-model:visible="deleteProductDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
      <div class="flex items-center gap-4">
        <i class="pi pi-exclamation-triangle !text-3xl" />
        <span>Are you sure you want to delete <b>{{ product.groupName }}</b>?</span>
      </div>
      <template #footer>
        <Button label="No" icon="pi pi-times" text @click="deleteProductDialog = false" />
        <Button label="Yes" icon="pi pi-check" :loading="deleteMutation.isPending.value" @click="deleteProduct" />
      </template>
    </Dialog>

    <!-- Delete Multiple Dialog -->
    <Dialog :loading = "deleteMutation.isPending" v-model:visible="deleteProductsDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
      <div class="flex items-center gap-4">
        <i class="pi pi-exclamation-triangle !text-3xl" />
        <span>Are you sure you want to delete the selected groups?</span>
      </div>
      <template #footer>
        <Button label="No" icon="pi pi-times"  @click="deleteProductsDialog = false" />
        <Button label="Yes" icon="pi pi-check" :loading="deleteMutation.isPending.value" @click="deleteSelectedProducts" />
      </template>
    </Dialog>
  </div>
</template>
