<template>
  <UModal :modelValue="isOpen" @update:modelValue="val => $emit('update:isOpen', val)">
    <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
      <template #header>
        <h2 class="h-8">{{ mode }} Account </h2>
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
const toast = useToast()

const props = defineProps({
  isOpen: Boolean,
  authenticatedUser: Object,
  mode: String,
  accountToEdit: Object
})

const emit = defineEmits(['update:isOpen', 'refreshList'])

let accountToCreate = {
  name: ''
};

const userId = computed(() => props.authenticatedUser?.id)

const submitForm = async () => {
  try {

    let responseText = ''
    if (props.mode == 'Create') {
      accountToCreate.user_id = userId.value
      const response = await $fetch(runtimeConfig.public.BACKEND_API_BASE_PATH + '/accounts', {
        method: 'POST',
        body: JSON.stringify(accountToCreate),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      //TODO this clean doesn't work, but it is merely aesthetical, could delete with no problems
      cleanAccount();
      responseText = 'Account created'
    } else if (props.mode == 'Edit') {
      const response = await $fetch(runtimeConfig.public.BACKEND_API_BASE_PATH + '/accounts/' + props.accountToEdit.id, {
        method: 'PUT',
        body: JSON.stringify(accountToCreate),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      responseText = 'Account edited'
    }

    toast.add({ title: "Success: " + responseText })
    emit('refreshList');

  } catch (error) {
    toast.add({ title: "ERROR: " + error })
  }
};

const cleanAccount = () => {
  accountToCreate = {
    name: '',
    user_id: null
  };
}

watch(() => props.isOpen, (newVal, oldVal) => {

  if (props.mode == 'Edit') {
    accountToCreate.name = props.accountToEdit.name
  }
  if (!newVal && oldVal) {
    cleanAccount()
  }
});
</script>