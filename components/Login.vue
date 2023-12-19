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

const email = ref('')
const password = ref('')

const authStore = useAuthStore()

async function login() {
  try {
    //TODO find a way to make these paths constant
    const response = await $fetch('http://localhost:3001/users/login', {
      method: 'POST',
      body: {
        email: email.value,
        password: password.value
      }
    })

    //TODO save user info to use on other pages and requests
    console.log(response)
    const token = response.token

    // Store the token 
    authStore.setToken(token)
    console.log("Login successful!")
    await navigateTo('/dashboard')
  } catch (error) {
    //TODO; show error or smthn,  Handle login error
    console.error('Login failed:', error)
  }
}
</script>
 