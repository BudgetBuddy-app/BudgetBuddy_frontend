<template>
  <button @click="logout">Logout</button>
</template>
 
<script setup>
//TODO add a logout button in the user info page, make a dropdown when you click on the navbar, one option is user info, other is logout directly
import { useAuthStore } from '~/store/auth'

const store = useAuthStore()

async function logout() {
  //TODO clean token from store
  store.removeToken()
  // Redirect or perform other actions after logout
}
</script>
 