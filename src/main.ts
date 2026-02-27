import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'
import ConfirmationService from 'primevue/confirmationservice'
import ToastService from 'primevue/toastservice'
import StyleClass from 'primevue/styleclass'
import Toast from 'primevue/toast'
import '@/assets/tailwind.css'
import '@/assets/styles.scss'
import { Form } from '@primevue/forms';
import { VueQueryPlugin } from '@tanstack/vue-query'

const app = createApp(App)
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: '.app-dark',
    },
  },
})
app.use(createPinia())
app.use(VueQueryPlugin)
app.use(router)
app.use(ToastService)
app.component('Toast', Toast);
app.component('Form', Form);
app.directive('styleclass', StyleClass)
app.use(ConfirmationService)
app.mount('#app')
