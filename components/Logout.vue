<template>
  <div>
    <UButton @click="logout" class="bg-secondary">Logout</UButton>
  </div>
</template>
 
<script setup>
import { useAuthStore } from '~/store/auth'
const toast = useToast()

const store = useAuthStore()

async function logout() {
  store.removeToken()
  toast.add({ title: "Logging out..." })
  await navigateTo('/')
}
</script>
 