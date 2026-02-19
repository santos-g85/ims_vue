<script setup lang="ts">
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { z } from 'zod'
import { useToast } from 'primevue/usetoast'

const toast = useToast()

interface FormInput {
  valid: boolean
}

const resolver = zodResolver(
  z.object({
    username: z.string().min(1, { message: 'Username is required.' }),
    password: z.string().min(1, { message: 'Password is required.' }),
  }),
)

const onFormSubmit = ({ valid }: FormInput) => {
  if (valid) {
    toast.add({ severity: 'success', summary: 'Form is submitted.', life: 3000 })
  }
}
</script>

<template>
  <div
    class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden"
  >
    <div class="flex flex-col items-center justify-center">
      <Card style="width: 25rem; overflow: hidden">
        <template #header>
          <img alt="user header" src="" />
        </template>
        <template #title>Advanced Card</template>
        <template #subtitle>Card subtitle</template>
        <template #content>
          <Form :resolver @submit="onFormSubmit" class="flex flex-col gap-4 w-full sm:w-56">
            <FormField
              v-slot="$field"
              as="section"
              name="username"
              initialValue=""
              class="flex flex-col gap-2"
            >
              <InputText type="text" placeholder="Username" />
              <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                $field.error?.message
              }}</Message>
            </FormField>
            <FormField v-slot="$field" asChild name="password" initialValue="">
              <section class="flex flex-col gap-2">
                <Password type="text" placeholder="Password" :feedback="false" toggleMask fluid />
                <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
                  $field.error?.message
                }}</Message>
              </section>
            </FormField>
            <Button type="submit" severity="secondary" label="Submit" /> </Form
        ></template>
      </Card>
    </div>
  </div>
</template>

<style scoped>
.pi-eye {
  transform: scale(1.6);
  margin-right: 1rem;
}

.pi-eye-slash {
  transform: scale(1.6);
  margin-right: 1rem;
}
</style>
