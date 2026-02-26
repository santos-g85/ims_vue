import { defineStore } from 'pinia'
import logo from '@/assets/img/logo.jpg'

export const useImageStore = defineStore('image', {
  state: () => ({
    logo
  })
})
