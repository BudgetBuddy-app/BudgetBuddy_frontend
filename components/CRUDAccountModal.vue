<template>
  <UModal :modelValue="isOpen" @update:modelValue="val => $emit('update:isOpen', val)">
    <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
      <template #header>
        <h1 class="h-8">{{ mode }} Account </h1>
      </template>

      <form v-if="mode != 'Delete'" @submit.prevent="submitForm">
        <label>Name:</label>
        <UInput type="name" v-model="accountForm.name" />
        <UButton type="submit">Submit</UButton>
      </form>

      <div v-else class="flex flex-col items-center">
        <div class="pb-4">Are you sure you want to delete the <b>{{ accountToEdit.name }}</b> account?</div>
        <UButton @click="submitForm" color="red" size="xl">DELETE</UButton>
      </div>

      <template #footer>
        <div class="h-8">
          <span v-if="mode != 'Delete'">There can be many accounts with the same name.</span>
          <span v-else><b>WARNING:</b> This change is permanent, and will <b>delete all the transactions</b> associated
            with this account!</span>
        </div>
      </template>
    </UCard>
  </UModal>
</template>

<script setup>
import { useRuntimeConfig } from '#app'
import { useAuthStore } from '~/store/auth'

const runtimeConfig = useRuntimeConfig()
const toast = useToast()

const props = defineProps({
  isOpen: Boolean,
  mode: String,
  accountToEdit: Object
})

const emit = defineEmits(['update:isOpen', 'refreshList', 'closeModal'])

let accountForm = {};

const authStore = useAuthStore();
let authenticatedUser = authStore.getAuthenticatedUser()
const userId = computed(() => authenticatedUser.id)

const submitForm = async () => {
  try {
    let responseText = ''
    if (props.mode == 'Create') {
      accountForm.user_id = userId.value
      const response = await $fetch(runtimeConfig.public.BACKEND_API_BASE_PATH + '/accounts', {
        method: 'POST',
        body: JSON.stringify(accountForm),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      responseText = 'Account created'
      emit('closeModal');
    } else if (props.mode == 'Edit') {
      const response = await $fetch(runtimeConfig.public.BACKEND_API_BASE_PATH + '/accounts/' + props.accountToEdit.id, {
        method: 'PUT',
        body: JSON.stringify(accountForm),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      responseText = 'Account edited'
    } else if (props.mode == 'Delete') {
      const response = await $fetch(runtimeConfig.public.BACKEND_API_BASE_PATH + '/accounts/' + props.accountToEdit.id, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      responseText = 'Account deleted'
      emit('closeModal');
    }

    toast.add({ title: "Success: " + responseText })
    emit('refreshList');

  } catch (error) {
    toast.add({ title: "ERROR: " + error })
  }
};

const cleanAccount = () => {
  accountForm = {
    name: '',
    user_id: null
  };
}
cleanAccount();

watch(() => props.isOpen, (newVal, oldVal) => {

  if (props.mode == 'Edit') {
    accountForm.name = props.accountToEdit.name
  }
  if (!newVal && oldVal) {
    cleanAccount()
  }
});
</script>