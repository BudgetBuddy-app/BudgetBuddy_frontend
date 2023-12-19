<template>
  <form @submit.prevent="login">
    <input v-model="email" type="text" placeholder="Email" />
    <input v-model="password" type="password" placeholder="Password" />
    <button type="submit">Login</button>
  </form>
</template>
 
<script setup>
import { ref } from 'vue'
import { useAuthStore } from '~/store/auth'
import { useRuntimeConfig } from '#app'


const email = ref('')
const password = ref('')

const authStore = useAuthStore()
const runtimeConfig = useRuntimeConfig()

async function login() {
  try {
    const response = await $fetch(runtimeConfig.public.BACKEND_API_BASE_PATH + '/auth/login', {
      method: 'POST',
      body: {
        email: email.value,
        password: password.value
      }
    })

    //TODO save user info to use on other pages and requests

    // Store the token 
    authStore.setToken(response.token)
    console.log("Login successful!")
    await navigateTo('/dashboard')
  } catch (error) {
    //TODO; show error or smthn,  Handle login error
    console.error('Login failed:', error)
  }
}
</script>
 