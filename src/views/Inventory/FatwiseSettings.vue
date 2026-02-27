<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from 'primevue/usetoast';
import { useFatRateStore } from '@/stores/FatRate.store';
import type { FatwiseSetting } from '@/types/FatwiseSetttings';
import { storeToRefs } from 'pinia'

const downloadfileName = 'fatwise_settings_' + new Date().getTime();

const fatRateStore = useFatRateStore();
const { fatRates } = storeToRefs(fatRateStore)
onMounted(async () => {
  await fatRateStore.fetchFatRates();
});

const saving = ref(false);
const toast = useToast();
const dt = ref();
const products = ref<FatwiseSetting[]>([]);
const productDialog = ref(false);
const deleteProductDialog = ref(false);
const deleteProductsDialog = ref(false);
const product = ref<Partial<FatwiseSetting>>({});
const selectedProducts = ref<FatwiseSetting[]>([]);
const filters = ref({
  'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
});
const submitted = ref(false);


const formatDate = (value: Date) => {
  if (!value) return ''
  return new Date(value).toLocaleDateString()
}

const openNew = () => {
  product.value = {};
  submitted.value = false;
  productDialog.value = true;
};
const hideDialog = () => {
  productDialog.value = false;
  submitted.value = false;
};
const saveProduct = async () => {
  submitted.value = true;
  if (!product.value.snfRate || !product.value.faRate) return
  saving.value = true;
  try {
    if (product.value.id) {
      await fatRateStore.updateFatRate(product.value.id, product.value as FatwiseSetting)
      toast.add({ severity: 'success', summary: 'Success', detail: 'Fat Rate Settings Updated', life: 3000 })
    } else {
      product.value.trnDate = new Date();
      product.value.localDate = new Date().toLocaleDateString();
      await fatRateStore.createFatRate(product.value)
      toast.add({ severity: 'success', summary: 'Success', detail: 'Fat Rate Settings Created', life: 3000 })
    }
    productDialog.value = false
    product.value = {}
  }
   catch (error : unknown) {
    if(error instanceof Error) {
      toast.add({ severity: 'error', summary: 'Error', detail: error.message, life: 3000 })
    } else {
      toast.add({ severity: 'error', summary: 'Error', detail: 'An unknown error occurred', life: 3000 })
    }
  } finally {
    saving.value = false;
  }};

const editProduct = (prod : FatwiseSetting) => {
  product.value = { ...prod };
  productDialog.value = true;
};

const confirmDeleteProduct = (prod : FatwiseSetting) => {
  product.value = prod;
  deleteProductDialog.value = true;
};

const deleteProduct = async () => {
  try {
   // await fatRateStore.deleteFatRate(product.value.trnDate!)
    products.value = products.value.filter(val => val.trnDate !== product.value.trnDate);
    deleteProductDialog.value = false;
    product.value = {};
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Fat Rate Settings Deleted', life: 3000 });
  } catch (error : unknown) {
    if(error instanceof Error) {
      toast.add({ severity: 'error', summary: 'Error', detail: error.message, life: 3000 })
    } else {
      toast.add({ severity: 'error', summary: 'Error', detail: 'An unknown error occurred', life: 3000 })
    }
  }
};

const exportCSV = () => {
  dt.value.exportCSV(downloadfileName);
};
const confirmDeleteSelected = () => {
  deleteProductsDialog.value = true;
};
const deleteSelectedProducts = () => {
  products.value = products.value.filter(val => !selectedProducts.value.includes(val));
  deleteProductsDialog.value = false;
  selectedProducts.value = [];
  toast.add({ severity: 'success', summary: 'Successful', detail: 'Fat Rate Settings Deleted', life: 3000 });
};

</script>
<template>
  <div>
    <div class="card">
      <Toolbar class="mb-6">
        <template #start>
          <Button label="New" icon="pi pi-plus" class="mr-2" @click="openNew" />
          <Button style="margin-left: 10px;" label="Delete" icon="pi pi-trash" severity="danger" variant="outlined" @click="confirmDeleteSelected"
            :disabled="!selectedProducts || !selectedProducts.length" />
        </template>
        <template #end>
          <Button label="Export" icon="pi pi-upload" severity="secondary" @click="exportCSV()" />
        </template>
      </Toolbar>

      <DataTable ref="dt" v-model:selection="selectedProducts" :value="fatRates" dataKey="id" :paginator="true"
        :rows="5" :filters="filters"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        :rowsPerPageOptions="[5, 10, 25]"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products">
        <template #header>
          <div class="flex flex-wrap gap-2 items-center justify-between">
            <h4 class="m-0">Manage Fat Rate</h4>
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
        <Column field="trnDate" header="Trn Date" sortable style="min-width: 8rem">
          <template #body="slotProps">
            {{ formatDate(slotProps.data.trnDate) }}
          </template>
        </Column>
         <Column field="localDate" header="Local Date" sortable style="min-width: 8rem">
          <template #body="slotProps">
            {{ formatDate(slotProps.data.localDate) }}
          </template>
        </Column>
         <Column field="faRate" header="Fat Rate" sortable style="min-width: 8rem"></Column>
         <Column field="snfRate" header="SNF Rate" sortable style="min-width: 8rem"></Column>
         <Column field="remarks" header="Remarks" sortable style="min-width: 12rem"></Column>
        <Column :exportable="false" style="min-width: 12rem">
          <template #body="slotProps">
            <Button icon="pi pi-pencil" variant="outlined" rounded class="mr-2" @click="editProduct(slotProps.data)" />
            <Button style="margin-left: 5px;" icon="pi pi-trash" variant="outlined" rounded severity="danger"
              @click="confirmDeleteProduct(slotProps.data)" />
          </template>
        </Column>
      </DataTable>
    </div>
    <Dialog
     :loading="saving"
      :disabled="saving"
      v-model:visible="productDialog" :style="{ width: '450px' }" header="Product Details" :modal="true">
      <div class="flex flex-col gap-6">
         <div class="grid grid-cols-12 gap-4">
          <div class="col-span-6">
            <label for="faRate" class="block font-bold mb-3">fat Rate</label>
            <InputNumber id="faRate" v-model="product.faRate" fluid />
          </div>
          <div class="col-span-6 ml-2">
            <label for="snfRate" class="block font-bold mb-3">snfRate</label>
            <InputNumber id="snfRate" v-model="product.snfRate" fluid />
          </div>
        </div>
        <div>
          <label for="remarks" class="block font-bold mb-3">Remarks</label>
          <Textarea id="remarks" v-model="product.remarks" required="true" rows="3" cols="20" fluid />
        </div>
      </div>
      <template #footer>
        <Button label="Cancel" icon="pi pi-times" text @click="hideDialog" />
        <Button label="Save" icon="pi pi-check" @click="saveProduct" />
      </template>
    </Dialog>

    <Dialog v-model:visible="deleteProductDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
      <div class="flex items-center gap-4">
        <i class="pi pi-exclamation-triangle !text-3xl" />
        <span v-if="product">Are you sure you want to delete Fat Rate settings for <b>{{ product.trnDate}}</b>?</span>
      </div>
      <template #footer>
        <Button label="No" icon="pi pi-times" text @click="deleteProductDialog = false" severity="secondary"
          variant="text" />
        <Button label="Yes" icon="pi pi-check" @click="deleteProduct" severity="danger" />
      </template>
    </Dialog>

    <Dialog v-model:visible="deleteProductsDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
      <div class="flex items-center gap-4">
        <i class="pi pi-exclamation-triangle !text-3xl" />
        <span v-if="product">Are you sure you want to delete the selected products?</span>
      </div>
      <template #footer>
        <Button label="No" icon="pi pi-times" text @click="deleteProductsDialog = false" severity="secondary"
          variant="text" />
        <Button label="Yes" icon="pi pi-check" text @click="deleteSelectedProducts" severity="danger" />
      </template>
    </Dialog>
  </div>
</template>
