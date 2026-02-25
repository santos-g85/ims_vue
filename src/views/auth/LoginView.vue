<script setup lang="ts">
import { ref } from 'vue'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { z } from 'zod'
import { useToast } from 'primevue/usetoast'
import { type FormSubmitEvent } from '@primevue/forms';
import { useAuthStore } from '@/stores/Auth.store'
import type { LoginRequest} from '@/types/Auth'
import { ENV } from '@/env'

const authstore = useAuthStore()

const toast = useToast()

const initialValues = ref({
  username: '',
  password: '',
})

const resolver = zodResolver(
  z.object({
    username: z.string().min(1, { message: 'Email is required.' }).email({ message: 'Invalid email address.' }),
    password: z
      .string()
      .min(3, { message: 'Minimum 5 characters.' })
      .max(8, { message: 'Maximum 8 characters.' })
      .refine((value) => /[a-z]/.test(value), {
        message: 'Must have a lowercase letter.',
      })
      .refine((value) => /[A-Z]/.test(value), {
        message: 'Must have an uppercase letter.',
      })
      .refine((value) => /[0-9]/.test(value), {
        message: 'Must have a number.',
      }),
  }),
)

const onFormSubmit = async (e : FormSubmitEvent) => {
  // e.originalEvent: Represents the native form submit event.
  // e.valid: A boolean that indicates whether the form is valid or not.
  // e.states: Contains the current state of each form field, including validity status.
  // e.errors: An object that holds any validation errors for the invalid fields in the form.
  // e.values: An object containing the current values of all form fields.
  // e.reset: A function that resets the form to its initial state.
  const loginRequest : LoginRequest =(
    e.values.username,
    e.values.password
  )
  if (e.valid) {
    await authstore.login(loginRequest)
    toast.add({ severity: 'success', summary: 'Login successful.', life: 3000 })
    e.reset()
  }
}
</script>

<template>
  <div
    class="flex items-center justify-center min-h-screen w-full bg-surface-50 dark:bg-surface-950 px-4"
  >
    <Toast />
    <div
      class="card flex flex-col p-8 shadow-lg rounded-xl dark:border-surface-700 bg-surface-0 dark:bg-surface-900"
      style="width: 25rem; overflow: hidden"
    >
      <div class="flex flex-col items-center gap-2 mb-6">
        <img src="../../assets/img/logo.jpg" alt="Logo" class="w-16 h-16 mb-4 mx-auto" />
        <span>{{ ENV.APP_NAME }}</span>
      </div>
      <Divider layout="horizontal" class="!flex md:!hidden" align="center"><b>Sign In</b></Divider>
      <Form
        v-slot="$form"
        :initialValues
        :resolver
        @submit="onFormSubmit"
        class="flex flex-col gap-4 w-full"
      >
        <div class="flex flex-col gap-1" style="margin-top: 10px">
<label for="username" class="font-medium text-surface-900 dark:text-surface-0">Email</label>
          <InputText name="username" type="text" placeholder="" fluid />
          <Message v-if="$form.username?.invalid" severity="error" size="small" variant="simple">
            {{ $form.username.error?.message }}
          </Message>
        </div>

        <div class="flex flex-col gap-1" style="margin-top: 10px">
<label for="password" class="font-medium text-surface-900 dark:text-surface-0">Password</label>
          <Password name="password" placeholder="" :feedback="false" toggleMask fluid />
          <Message v-if="$form.password?.invalid" severity="error" size="small" variant="simple">
            <ul class="my-0 px-4 flex flex-col gap-1">
              <li v-for="(error, index) of $form.password.errors" :key="index">
                {{ error.message }}
              </li>
            </ul>
          </Message>
        </div>
        <Button
          type="submit"
          label="Sign In"
          icon="pi pi-user"
          severity="success"
          class="mt-4"
          style="margin-top: 15px"
        />
        <Divider layout="horizontal" class="!flex md:!hidden" align="center"><b>Or</b></Divider>
        <Button
          type="submit"
          label="Sign In with Google"
          icon="pi pi-google"
          severity="success"
          class="mt-4"
        />
      </Form>
    </div>
  </div>
</template>
