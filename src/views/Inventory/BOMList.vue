<script setup lang="ts">
const filename = "bom_list_" + new Date().toISOString().slice(0, 10)
</script>
<template>
  <div class="card">
    <Toolbar class="mb-6">
      <template #start>
        <Button label="New" icon="pi pi-plus" class="mr-2" />
        <Button label="Delete" icon="pi pi-trash" severity="danger" variant="outlined" style="margin-left: 10px" />
      </template>
      <template #end>
        <Button label="Export" icon="pi pi-upload" severity="secondary" />
      </template>
    </Toolbar>
    <DataTable rowGroupMode="subheader" groupRowsBy="representative.name" sortMode="single"
      sortField="representative.name" :sortOrder="1" scrollable scrollHeight="400px" tableStyle="min-width: 50rem"
      :paginator="true" :rows="5"
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
      :rowsPerPageOptions="[5, 10, 15]"
      currentPageReportTemplate="Showing {first} to {last} of {totalRecords} BOMs" :exportFilename="filename">
      <template #header>
        <div class="flex flex-wrap gap-2 items-center justify-between">
          <h4 class="m-0">BOM Details</h4>
          <IconField>
            <InputIcon>
              <i class="pi pi-search" />
            </InputIcon>
            <InputText placeholder="Search..." />
          </IconField>
        </div>
      </template>
      <Column field="representative.name" header="Representative"></Column>
      <Column field="name" header="Name" style="min-width: 200px"></Column>
      <Column field="country" header="Country" style="min-width: 200px">
        <template #body="slotProps">
          <div class="flex items-center gap-2">
            <img alt="flag" src="https://primefaces.org/cdn/primevue/images/flag/flag_placeholder.png"
              :class="`flag flag-${slotProps.data.country.code}`" style="width: 24px" />
            <span>{{ slotProps.data.country.name }}</span>
          </div>
        </template>
      </Column>
      <Column field="company" header="Company" style="min-width: 200px"></Column>
      <Column field="status" header="Status" style="min-width: 200px">
        <template #body="slotProps">
          <Tag :value="slotProps.data.status" />
        </template>
      </Column>
      <Column field="date" header="Date" style="min-width: 200px"></Column>
      <template #groupheader="slotProps">
        <div class="flex items-center gap-2">
          <img :alt="slotProps.data.representative.name"
            :src="`https://primefaces.org/cdn/primevue/images/avatar/${slotProps.data.representative.image}`" width="32"
            style="vertical-align: middle" />
          <span>{{ slotProps.data.representative.name }}</span>
        </div>
      </template>
      <template #groupfooter>
        <div class="flex justify-end font-bold w-full">Total </div>
      </template>
    </DataTable>
  </div>
</template>
