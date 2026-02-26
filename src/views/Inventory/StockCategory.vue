<script setup lang="ts">
import { useStockCategoryStore, useStockGroupStore } from '@/stores/stock.store'
import { onMounted, ref } from 'vue'
import { FilterMatchMode } from '@primevue/core/api'
import { useToast } from 'primevue/usetoast'
import type { StockCategory } from '@/types/Stock'
import router from '@/router'

const stockCategoryStore = useStockCategoryStore()
const stockGroupStore = useStockGroupStore()

onMounted(async () => {
  await stockCategoryStore.fetchStockCategories()
  filteredCategories.value = [...stockCategoryStore.stockCategories]
  await stockGroupStore.fetchStockGroups()
  filteredParentGroups.value = [...stockGroupStore.stockGroups]
})

const submitted = ref(false)
const products = ref<Partial<StockCategory>>({})
const selectedProducts = ref<StockCategory[]>([])

const toast = useToast()
const dt = ref()
const filename = "stock_categories_" + new Date().toISOString().slice(0, 10)
function exportCSV() {
  dt.value.exportCSV(filename)
}

const CreateDialog = ref(false)
const openNew = () => {
  CreateDialog.value = true;
};
const saveProduct = () => {
  // Implement save logic here
  hideDialog();
  toast.add({ severity: 'success', summary: 'Successful', detail: 'Category Saved', life: 3000 });
}
const hideDialog = () => {
  CreateDialog.value = false;
}

const filters = ref({
  'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
});

const deleteDialog = ref(false);
const hideDeleteDialog = () => {
  deleteDialog.value = false;
}

function confirmDeleteSelected() {
  deleteDialog.value = true
}
const deleteProducts = () => {
  hideDeleteDialog();
  toast.add({ severity: 'success', summary: 'Successful', detail: 'Category Deleted', life: 3000 });
}
const editProduct = (product: StockCategory) => {
  toast.add({ severity: 'info', summary: 'Info', detail: `Edit ${product.name} not implemented`, life: 3000 });
}
const confirmDeleteProduct = (product: StockCategory) => {
  products.value = product
  deleteDialog.value = true
}

const selectedCategory = ref();
const filteredCategories = ref();

const search = (event: any) => {
  const query = event.query?.toLowerCase() || ''
  if (!query) {
    filteredCategories.value = [...stockCategoryStore.stockCategories]
    return
  }

  filteredCategories.value =
    stockCategoryStore.stockCategories.filter((category) =>
      category.name.toLowerCase().includes(query)
    )
}

const selectedParentGroup = ref()
const filteredParentGroups = ref()

const searchParentGroup = (event: any) => {
  const query = event.query?.toLowerCase() || ''

  if (!query) {
    filteredParentGroups.value = [...stockGroupStore.stockGroups]
    return
  }

  filteredParentGroups.value =
    stockGroupStore.stockGroups.filter((group) =>
      group.groupName.toLowerCase().includes(query)
    )
}
const addStockGroup = () => {
 router.push('/inventory/stock-group')
}

</script>
<template>
  <div>
    <div class="card">
      <Toolbar class="mb-6">
        <template #start>
          <Button label="New" icon="pi pi-plus" class="mr-2" @click="openNew()" />
          <Button label="Delete" icon="pi pi-trash" severity="danger" @click="confirmDeleteSelected()"
            variant="outlined" style="margin-left: 10px"  :disabled="!selectedProducts || !selectedProducts.length"/>
        </template>
        <template #end>
          <Button label="Export" icon="pi pi-upload" severity="secondary" @click="exportCSV()" />
        </template>
      </Toolbar>
      <DataTable ref="dt" dataKey="id" :value="stockCategoryStore.stockCategories" v-model:selection="selectedProducts"
        :filters="filters" :paginator="true" :rows="5"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        :rowsPerPageOptions="[5, 10, 15]"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} categories" :exportFilename="filename">

        <template #header>
          <div class="flex flex-wrap gap-2 items-center justify-between">
            <h4 class="m-0">Stock Categories</h4>
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
        <Column field="name" header="Name"></Column>
        <Column field="aliasName" header="Alias"></Column>
        <Column field="parentGroupName" header="Parent Group"></Column>
        <Column field="parentCategoryName" header="Parent Category"></Column>
        <Column :exportable="false" style="min-width: 12rem;">
          <template #body="slotProps">
            <Button icon="pi pi-pencil" variant="outlined" rounded class="mr-2" @click="editProduct(slotProps.data)" />
            <Button icon="pi pi-trash" variant="outlined" rounded severity="danger" style="margin-left: 5px;"
              @click="confirmDeleteProduct(slotProps.data)" />
          </template>
        </Column>
      </DataTable>
    </div>
    <!--Create new products-->
    <Dialog v-model:visible="CreateDialog" :style="{ width: '450px' }" header="Create Stock Category" :modal="true">
      <div class="flex flex-col gap-6">
        <div>
          <label for="name" class="block font-bold mb-3">Name</label>
          <InputText id="name" v-model.trim="products.name" required="true" autofocus :invalid="submitted && !products.name" fluid />
          <small v-if="submitted && !products.name" class="text-red-500">Name is required.</small>
        </div>
        <div>
          <label for="aliasName" class="block font-bold mb-3">Alias Name</label>
          <InputText id="aliasName" v-model.trim="products.aliasName" required="true" autofocus
            :invalid="submitted && !products.aliasName" fluid />
          <small v-if="submitted && !products.aliasName" class="text-red-500">Alias Name is required.</small>
        </div>
        <div>
          <label for="parentCategoryid" class="block font-bold mb-3">Parent Category</label>
          <AutoComplete  v-model="selectedCategory" optionLabel="name" :suggestions="filteredCategories"
            @complete="search">
            <template #option="slotProps">
              <div class="flex items-center">
                <div>{{ slotProps.option.name }}</div>
              </div>
            </template>
            <template #header>
              <div class="font-medium px-3 py-2">Available Categories</div>
            </template>
          </AutoComplete>
        </div>
        <div>
          <label for="parentGroupid" class="block font-bold mb-3">Parent Group</label>
          <AutoComplete v-model="selectedParentGroup" optionLabel="groupName" :suggestions="filteredParentGroups" @complete="searchParentGroup">
            <template #option="slotProps">
                <div class="flex items-center">
                    <div>{{ slotProps.option.groupName }}</div>
                </div>
            </template>
            <template #header>
                <div class="font-medium px-3 py-2">Available Groups</div>
            </template>
            <template #footer>
                <div class="px-3 py-3">
                    <Button label="Add New" fluid severity="secondary" text size="small" icon="pi pi-plus" @click="addStockGroup()" />
                </div>
            </template>
        </AutoComplete>
        </div>
      </div>
      <template #footer>
        <Button label="Cancel" icon="pi pi-times" text @click="hideDialog" />
        <Button label="Save" icon="pi pi-check" @click="saveProduct()" />
      </template>
    </Dialog>

    <!--Delete products-->
    <Dialog v-model:visible="deleteDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
      <div class="flex items-center gap-4">
        <i class="pi pi-exclamation-triangle !text-3xl" />
        <span v-if="products">Are you sure you want to delete {{ products.name }} <b> </b>?</span>
      </div>
      <template #footer>
        <Button label="No" icon="pi pi-times" text severity="secondary" variant="text" @click="hideDeleteDialog()" />
        <Button label="Yes" icon="pi pi-check" severity="danger" @click="deleteProducts()" />
      </template>
    </Dialog>
  </div>
</template>
