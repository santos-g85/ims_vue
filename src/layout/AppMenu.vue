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
    items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/' }],
  },
  {
    label: 'Master',
    items: [
      { label: 'Chart Of Accounts', icon: 'pi pi-fw pi-id-card', to: '/chart-of-accounts' },
      {
        label: 'Inventory',
        icon: 'pi pi-fw pi-user',
        items: [
          {
            label: 'Stock Group',
            icon: 'pi pi-fw pi-sign-in',
            to: '/inventory/stock-group',
          },
          {
            label: 'Stock Category',
            icon: 'pi pi-fw pi-sign-in',
            to: '/inventory/stock-category',
          },
          {
            label: 'Stock Item',
            icon: 'pi pi-fw pi-sign-in',
            to: '/inventory/stock-item',
          },
          {
            label: 'GoDown',
            icon: 'pi pi-fw pi-sign-in',
            to: '/inventory/godown',
          },
          {
            label: 'Tax Classification',
            icon: 'pi pi-fw pi-sign-in',
            to: '/inventory/tax',
          },
          {
            label: 'Unit Of Measure',
            icon: 'pi pi-fw pi-sign-in',
            to: '/inventory/unit',
          },
          {
            label: 'Fatwise Unit',
            icon: 'pi pi-fw pi-sign-in',
            to: '/inventory/fatwise',
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
        icon: 'pi pi-fw pi-user',
        items: [
          {
            label: 'Batch Tran.',
            icon: 'pi pi-fw pi-sign-in',
            to: '/inventory/stock-group',
          },
          {
            label: 'Contra',
            icon: 'pi pi-fw pi-sign-in',
            to: '/inventory/stock-category',
          },
          {
            label: 'Sales',
            icon: 'pi pi-fw pi-sign-in',
            to: '/inventory/stock-item',
          },
          {
            label: 'Purchase',
            icon: 'pi pi-fw pi-sign-in',
            to: '/inventory/godown',
          },
          {
            label: 'Receipt',
            icon: 'pi pi-fw pi-sign-in',
            to: '/inventory/tax',
          },
          {
            label: 'Payment',
            icon: 'pi pi-fw pi-sign-in',
            to: '/inventory/unit',
          },
          {
            label: 'Journal',
            icon: 'pi pi-fw pi-sign-in',
            to: '/inventory/fatwise',
          },
          {
            label: 'Sales Return',
            icon: 'pi pi-fw pi-sign-in',
            to: '/inventory/fatwise',
          },
          {
            label: 'Purchase Return',
            icon: 'pi pi-fw pi-sign-in',
            to: '/inventory/fatwise',
          },
          {
            label: 'Proforma Invoice',
            icon: 'pi pi-fw pi-sign-in',
            to: '/inventory/fatwise',
          },
          {
            label: 'Item Invoice',
            icon: 'pi pi-fw pi-sign-in',
            to: '/inventory/fatwise',
          },
          {
            label: 'As Invoice',
            icon: 'pi pi-fw pi-sign-in',
            to: '/inventory/fatwise',
          },
        ],
      },
      {
        label: 'Inventory Voucher',
        icon: 'pi pi-fw pi-user',
        items: [
          {
            label: 'Inv. Voucher',
            icon: 'pi pi-fw pi-sign-in',
            to: '/inventory/stock-group',
          },
          {
            label: 'Purchase Order',
            icon: 'pi pi-fw pi-sign-in',
            to: '/inventory/stock-group',
          },
          {
            label: 'Receipt Note',
            icon: 'pi pi-fw pi-sign-in',
            to: '/inventory/stock-group',
          },
          {
            label: 'Rejection Out',
            icon: 'pi pi-fw pi-sign-in',
            to: '/inventory/stock-group',
          },
          {
            label: 'Sales Order',
            icon: 'pi pi-fw pi-sign-in',
            to: '/inventory/stock-group',
          },
          {
            label: 'Delevery Note',
            icon: 'pi pi-fw pi-sign-in',
            to: '/inventory/stock-group',
          },
          {
            label: 'Rejection In',
            icon: 'pi pi-fw pi-sign-in',
            to: '/inventory/stock-group',
          },
          {
            label: 'Stock Journal',
            icon: 'pi pi-fw pi-sign-in',
            to: '/inventory/stock-group',
          },
          {
            label: 'Manufacture',
            icon: 'pi pi-fw pi-sign-in',
            to: '/inventory/stock-group',
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
            icon: 'pi pi-fw pi-bookmark',
            to: '',
          },
          {
            label: 'Balance Sheet',
            icon: 'pi pi-fw pi-bookmark',
            to: '',
          },
          {
            label: 'Profit & Loss',
            icon: 'pi pi-fw pi-bookmark',
            to: '',
          },
          {
            label: 'Stock Summary',
            icon: 'pi pi-fw pi-bookmark',
            to: '',
          },
        ],
      },
      {
        label: 'Reports',
        icon: 'pi pi-fw pi-bookmark',
        items: [
          {
            label: 'Accounts Books',
            icon: 'pi pi-fw pi-bookmark',
            items: [
              { label: 'Cash/Bank Books', icon: 'pi pi-fw pi-bookmark' },
              { label: 'Ledger', icon: 'pi pi-fw pi-bookmark' },
              { label: 'Ledger', icon: 'pi pi-fw pi-bookmark' },
              { label: 'Sales Register', icon: 'pi pi-fw pi-bookmark' },
              { label: 'Purchase Register', icon: 'pi pi-fw pi-bookmark' },
              { label: 'Journal Register', icon: 'pi pi-fw pi-bookmark' },
            ],
          },
          {
            label: 'Statement Of Accounts',
            icon: 'pi pi-fw pi-bookmark',
            items: [
              { label: 'Share Capital', icon: 'pi pi-fw pi-bookmark' },
              { label: 'Receivable', icon: 'pi pi-fw pi-bookmark' },
              { label: 'Payables', icon: 'pi pi-fw pi-bookmark' },
            ],
          },
          {
            label: 'Inventory Books',
            icon: 'pi pi-fw pi-bookmark',
            items: [
              { label: 'Stock Items', icon: 'pi pi-fw pi-bookmark' },
              { label: 'Group Summary', icon: 'pi pi-fw pi-bookmark' },
              { label: 'Sales Order Book', icon: 'pi pi-fw pi-bookmark' },
              { label: 'Purchase Order Book', icon: 'pi pi-fw pi-bookmark' },
              { label: 'Stock Transfer', icon: 'pi pi-fw pi-bookmark' },
              { label: 'Movement Analysis', icon: 'pi pi-fw pi-bookmark' },
              { label: 'Ageing Analysis', icon: 'pi pi-fw pi-bookmark' },
            ],
          },
          {
            label: 'Statement Of Inventory',
            icon: 'pi pi-fw pi-bookmark',
            items: [
              { label: 'Locations', icon: 'pi pi-fw pi-bookmark' },
              { label: 'Categories', icon: 'pi pi-fw pi-bookmark' },
              { label: 'Stock Query', icon: 'pi pi-fw pi-bookmark' },
              { label: 'Sales Order Outstanding', icon: 'pi pi-fw pi-bookmark' },
              { label: 'Purchase Order Outstanding', icon: 'pi pi-fw pi-bookmark' },
              { label: 'Purchase Bill Pending', icon: 'pi pi-fw pi-bookmark' },
              { label: 'Sales Bill Pending', icon: 'pi pi-fw pi-bookmark' },
            ],
          },
          {
            label: 'Receipts & Payments',
            icon: 'pi pi-fw pi-bookmark',
            to: '',
          },
          {
            label: 'List Of Accounts',
            icon: 'pi pi-fw pi-bookmark',
            to: '',
          },
        ],
      },
    ],
  },
  {
    label: 'Administration',
    items: [
      {
        label: 'Documentation',
        icon: 'pi pi-fw pi-book',
        to: '/documentation',
      },
      {
        label: 'Company Info',
        icon: 'pi pi-fw pi-book',
        to: '/company',
      },
      {
        label: 'User',
        icon: 'pi pi-fw pi-user',
        items: [
          { label: 'Profile', icon: 'pi pi-fw pi-user' },
          { label: 'Roles', icon: 'pi pi-fw pi-user' },
          { label: 'Permisssion', icon: 'pi pi-fw pi-user' },
        ],
      },
      {
        label: 'Billing',
        icon: 'pi pi-fw pi-user',
        to: '/user',
      },
      {
        label: 'Settings',
        icon: 'pi pi-fw pi-user',
        items: [{ label: 'Cache', icon: 'pi pi-fw pi-user' }],
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
