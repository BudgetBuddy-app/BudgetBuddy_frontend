<template>
  <div>
    <UButton @click="logout" class="bg-secondary">Logout</UButton>
  </div>
</template>
 
<script setup>
import { useAuthStore } from '~/store/auth'

const store = useAuthStore()

async function logout() {
  store.removeToken()
  await navigateTo('/')
}
</script>
 