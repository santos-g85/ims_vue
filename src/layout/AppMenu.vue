<script setup lang="ts">
import { ref } from 'vue'
import AppMenuItem from './AppMenuItem.vue'

interface MenuItem {
  label: string
  icon?: string
  to?: string
  items?: MenuItem[]
  visible?: boolean
  disabled?: boolean
  separator?: boolean
  class?: string
  target?: string
  url?: string
  command?: (event: { originalEvent: Event; item: MenuItem }) => void
}

const model = ref<MenuItem[]>([
  {
    label: 'Home',
    items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/dashboard' }],
  },
  {
    label: 'Master',
    items: [
      { label: 'Chart Of Accounts', icon: 'pi pi-fw pi-check-square', to: '/charts-of-accounts' },
      {
        label: 'Inventory',
        icon: 'pi pi-fw pi-box',
        items: [
          {
            label: 'Stock Group',
            to: '/inventory/stock-group',
          },
          {
            label: 'Stock Category',
            to: '/inventory/stock-category',
          },
          {
            label: 'BOM List',
            to: '/inventory/bom-list',
          },
          {
            label: 'Stock Item',
          },
          {
            label: 'GoDown',
          },
          {
            label: 'Tax Classification',
          },
          {
            label: 'Unit Of Measure',
          },
          {
            label: 'Fatwise Unit',
          },
        ],
      },
    ],
  },
  {
    label: 'Transaction',
    items: [
      {
        label: 'Batch Transaction',
        icon: 'pi pi-fw pi-sync',
        items: [
          {
            label: 'Batch Tran.',
          },
          {
            label: 'Contra',
          },
          {
            label: 'Sales',
          },
          {
            label: 'Purchase',
          },
          {
            label: 'Receipt',
          },
          {
            label: 'Payment',
          },
          {
            label: 'Journal',
          },
          {
            label: 'Sales Return',
          },
          {
            label: 'Purchase Return',
          },
          {
            label: 'Proforma Invoice',
          },
          {
            label: 'Item Invoice',
          },
          {
            label: 'As Invoice',
          },
        ],
      },
      {
        label: 'Inventory Voucher',
        icon: 'pi pi-fw pi-receipt',
        items: [
          {
            label: 'Inv. Voucher',
          },
          {
            label: 'Purchase Order',
          },
          {
            label: 'Receipt Note',
          },
          {
            label: 'Rejection Out',
          },
          {
            label: 'Sales Order',
          },
          {
            label: 'Delevery Note',
          },
          {
            label: 'Rejection In',
          },
          {
            label: 'Stock Journal',
          },
          {
            label: 'Manufacture',
          },
        ],
      },
    ],
  },
  {
    label: 'Analytics',
    items: [
      {
        label: 'Glimpse',
        icon: 'pi pi-fw pi-bookmark',
        items: [
          {
            label: 'Trial Balance',
          },
          {
            label: 'Balance Sheet',
          },
          {
            label: 'Profit & Loss',
          },
          {
            label: 'Stock Summary',
          },
        ],
      },
      {
        label: 'Reports',
        icon: 'pi pi-fw pi-bookmark',
        items: [
          {
            label: 'Accounts Books',
            items: [
              { label: 'Cash/Bank Books' },
              { label: 'Ledger' },
              { label: 'Ledger' },
              { label: 'Sales Register' },
              { label: 'Purchase Register' },
              { label: 'Journal Register' },
            ],
          },
          {
            label: 'Statement Of Accounts',
            items: [{ label: 'Share Capital' }, { label: 'Receivable' }, { label: 'Payables' }],
          },
          {
            label: 'Inventory Books',
            items: [
              { label: 'Stock Items' },
              { label: 'Group Summary' },
              { label: 'Sales Order Book' },
              { label: 'Purchase Order Book' },
              { label: 'Stock Transfer' },
              { label: 'Movement Analysis' },
              { label: 'Ageing Analysis' },
            ],
          },
          {
            label: 'Statement Of Inventory',
            items: [
              { label: 'Locations' },
              { label: 'Categories' },
              { label: 'Stock Query' },
              { label: 'Sales Order Outstanding' },
              { label: 'Purchase Order Outstanding' },
              { label: 'Purchase Bill Pending' },
              { label: 'Sales Bill Pending' },
            ],
          },
          {
            label: 'Receipts & Payments',
          },
          {
            label: 'List Of Accounts',
          },
        ],
      },
    ],
  },
  {
    label: 'Administration',
    items: [
       {
        label: 'Billing',
        icon: 'pi pi-fw pi-money-bill',
      },
      {
        label: 'Company Info',
        icon: 'pi pi-fw pi-building-columns',
      },
         {
        label: 'Documentation',
        icon: 'pi pi-fw pi-book',
      },
      {
        label: 'Settings',
        icon: 'pi pi-fw pi-cog',
        items: [{ label: 'Cache', icon: 'pi pi-fw pi-user' }],
      },
       {
        label: 'User',
        icon: 'pi pi-fw pi-user',
        items: [{ label: 'Profile' }, { label: 'Roles' }, { label: 'Permisssion' }],
      },

    ],
  },
])
</script>

<template>
  <ul class="layout-menu">
    <template v-for="(item, i) in model" :key="item.label">
      <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
      <li v-if="item.separator" class="menu-separator"></li>
    </template>
  </ul>
</template>

<style lang="scss" scoped></style>
