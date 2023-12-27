<template>
  <div>
    <h2>Create Account</h2>
    <form @submit.prevent="submitForm">
      <label>Name:</label>
      <input type="text" v-model="user.name" />
      <label>Email:</label>
      <input type="email" v-model="user.email" />
      <label>Password:</label>
      <input type="password" v-model="user.password" />
      <UButton type="submit">Submit</UButton>
    </form>
  </div>
</template>
 
<script setup>
import { useRuntimeConfig } from '#app'

definePageMeta({
  layout: 'minimal'
})

const runtimeConfig = useRuntimeConfig()

let user = {
  name: '',
  email: '',
  password: ''
};

const submitForm = async () => {
  try {
    const response = await $fetch(runtimeConfig.public.BACKEND_API_BASE_PATH + '/users', {
      method: 'POST',
      body: JSON.stringify(user),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    //TODO, here we go automatilcally to main page, but validate the response code and see if it was successful or not, to shown an error
    await navigateTo('/dashboard')

  } catch (error) {
    console.error('ERROR:', error)
  }
};

</script>
 