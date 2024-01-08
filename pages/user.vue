<template>
    <div>

        <ClientOnly>
            <div v-if="authenticatedUser">
                <h2>Welcome, {{ authenticatedUser.name }}</h2>
                <div>Email: {{ authenticatedUser.email }}</div>
            </div>
        </ClientOnly>

        <UButton @click="reDirect('EditInfo')" size="xl">Edit account info</UButton>
        <UButton @click="reDirect('EditPassword')" size="xl">Change password</UButton>
        <UButton @click="reDirect('Delete')" color="red" size="xl">DELETE ACCOUNT</UButton>

        <CRUDUserModal :isOpen="isOpen" :mode="mode" @update:isOpen="isOpen = $event" @closeModal="closeModal()" />

        <Logout />

    </div>
</template>

<script setup>
import { useAuthStore } from '~/store/auth'

const authStore = useAuthStore();

let authenticatedUser = authStore.getAuthenticatedUser()
const isOpen = ref(false)
const mode = ref('')

const reDirect = async (type) => {
    mode.value = type
    isOpen.value = true
}

const closeModal = () => {
    isOpen.value = false
}

</script>