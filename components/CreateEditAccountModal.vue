<template>
  <UModal :modelValue="isOpen" @update:modelValue="val => $emit('update:isOpen', val)">
    <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
      <template #header>
        <h2 class="h-8">Create Account</h2>
      </template>

      <form @submit.prevent="submitForm">
        <label>Name:</label>
        <UInput type="name" v-model="accountToCreate.name" />
        <UButton type="submit">Submit</UButton>
      </form>

      <template #footer>
        <div class="h-8">There can be many accounts with the same name.</div>
      </template>
    </UCard>
  </UModal>
</template>

<script setup>
import { useRuntimeConfig } from '#app'
const runtimeConfig = useRuntimeConfig()

const props = defineProps({
  isOpen: Boolean,
  authenticatedUser: Object
})

const emit = defineEmits(['update:isOpen', 'refreshList'])

let accountToCreate = {
  name: ''
};

const userId = computed(() => props.authenticatedUser?.id)

const submitForm = async () => {
  try {
    accountToCreate.user_id = userId.value
    const response = await $fetch(runtimeConfig.public.BACKEND_API_BASE_PATH + '/accounts', {
      method: 'POST',
      body: JSON.stringify(accountToCreate),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    //TODO make this a popup, not a console log
    console.log("Success: ", response)

    emit('refreshList');

  } catch (error) {
    console.error('ERROR:', error)
  }
};
</script>