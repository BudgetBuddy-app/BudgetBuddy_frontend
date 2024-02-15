<template>
  <UModal :modelValue="isOpen" @update:modelValue="val => $emit('update:isOpen', val)">
    <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
      <template #header>
        <h1 class="h-8">{{ mode }} Account </h1>
      </template>

      <form v-if="mode === 'EditInfo'" @submit.prevent="submitForm">
        <label>Name:</label>
        <UInput type="name" v-model="accountForm.name" />
        <label>Email:</label>
        <UInput type="email" v-model="accountForm.email" />
        <UButton type="submit">Submit</UButton>
      </form>
      <form v-else-if="mode === 'EditPassword'" @submit.prevent="submitForm">
        <label>New Password:</label>
        <UInput type="password" v-model="passwordForm.password" />
        <UButton type="submit">Submit</UButton>
      </form>

      <div v-else class="flex flex-col items-center">
        <div class="pb-4">Are you sure you want to delete the <br /> <b> {{ authenticatedUser.name }} ( {{
          authenticatedUser.email
        }})</b> user?</div>
        <UButton @click="submitForm" color="red" size="xl" @submit.prevent="submitForm">DELETE</UButton>
      </div>

      <template #footer>
        <div class="h-8">
          <span v-if="mode != 'Delete'">This will log you out automatically, and affect your login credentials
            <b>immediately.</b></span>
          <span v-else><b>WARNING:</b> This change is permanent!</span>
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
})

const emit = defineEmits(['update:isOpen', 'closeModal'])

const authStore = useAuthStore();
let authenticatedUser = authStore.getAuthenticatedUser()

let accountForm = {};
let passwordForm = {};

const submitForm = async () => {
  try {
    let responseText = ''
    if (props.mode == 'EditInfo') {
      const response = await $fetch(runtimeConfig.public.BACKEND_API_BASE_PATH + '/users/' + authenticatedUser.id, {
        method: 'PUT',
        body: JSON.stringify(accountForm),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      responseText = 'Account edited'
    } else if (props.mode == 'EditPassword') {
      const response = await $fetch(runtimeConfig.public.BACKEND_API_BASE_PATH + '/users/' + authenticatedUser.id, {
        method: 'PUT',
        body: JSON.stringify(passwordForm),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      responseText = 'Password edited'
    } else if (props.mode == 'Delete') {
      const response = await $fetch(runtimeConfig.public.BACKEND_API_BASE_PATH + '/users/' + authenticatedUser.id, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      responseText = 'Account deleted'
      emit('closeModal');
    }

    toast.add({ title: "Success: " + responseText })
    authStore.removeToken()
    await navigateTo('/');

  } catch (error) {
    toast.add({ title: "ERROR: " + error })
  }
};

const cleanAccount = () => {
  accountForm = {
    name: authenticatedUser ? authenticatedUser.name : '',
    email: authenticatedUser ? authenticatedUser.email : ''
  };

  passwordForm = {
    password: ''
  };
}
cleanAccount()

watch(() => props.isOpen, (newVal, oldVal) => {

  if (!newVal && oldVal) {
    cleanAccount()
  }
});
</script>