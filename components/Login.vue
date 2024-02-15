<template>
  <form @submit.prevent="login">
    <UInput v-model="email" type="text" placeholder="Email" />
    <UInput v-model="password" type="password" placeholder="Password" />
    <UButton type="submit">Login</UButton>
  </form>
</template>
 
<script setup>
import { ref } from 'vue'
import { useAuthStore } from '~/store/auth'
import { useRuntimeConfig } from '#app'

const authStore = useAuthStore()
const runtimeConfig = useRuntimeConfig()
const toast = useToast()

const email = ref('')
const password = ref('')

async function login() {
  try {
    const response = await $fetch(runtimeConfig.public.BACKEND_API_BASE_PATH + '/auth/login', {
      method: 'POST',
      body: {
        email: email.value,
        password: password.value
      }
    })

    if (response.Login) {
      authStore.setToken(response.token)
      authStore.setAuthenticatedUser(response.User[0])
      toast.add({ title: "Login successful!" })

      await navigateTo('/statistics')
    } else {
      toast.add({ title: 'Login failed:' + response.Message })
    }

  } catch (error) {
    toast.add({ title: 'Login failed:', error })
  }
}
</script>
 