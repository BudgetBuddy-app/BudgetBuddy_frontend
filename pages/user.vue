<template>
    <div>

        <ClientOnly>
            <div>
                <h2>Welcome, {{ authenticatedUser.name }}</h2>
                <div>Email: {{ authenticatedUser.email }}</div>
            </div>
        </ClientOnly>

        <div class="pb-10">
            <UButton @click="reDirect('EditInfo')" size="xl">Edit account info</UButton>
            <UButton @click="reDirect('EditPassword')" size="xl">Change password</UButton>
            <UButton @click="reDirect('Delete')" color="red" size="xl">DELETE ACCOUNT</UButton>
        </div>

        <ClientOnly>
            <div v-if="authenticatedUser.id == 1" class="pb-10">
                <UButton @click="handleDB('CLEAN')" color="red" size="xl">Clean database (leave only admin user)</UButton>
                <UButton @click="handleDB('INSERT')" size="xl">Insert Dummy data</UButton>
            </div>
        </ClientOnly>

        <CRUDUserModal :isOpen="isOpen" :mode="mode" @update:isOpen="isOpen = $event" @closeModal="closeModal()" />

        <Logout />

    </div>
</template>

<script setup>
import { useAuthStore } from '~/store/auth'
import { useRuntimeConfig } from '#app'

const authStore = useAuthStore();
const runtimeConfig = useRuntimeConfig()
const toast = useToast()

let authenticatedUser = authStore.getAuthenticatedUser()
const isOpen = ref(false)
const mode = ref('')

const reDirect = async (type) => {
    mode.value = type
    isOpen.value = true
}

const handleDB = async (type) => {
    let endpoint = runtimeConfig.public.BACKEND_API_BASE_PATH
    let response = null
    try {
        if (type == "CLEAN") {
            response = await $fetch(endpoint + '/drop-tables', {
                method: 'GET',
            })

            await $fetch(endpoint + '/create-tables', {
                method: 'GET',
            })

        } else {
            response = await $fetch(endpoint + '/insert-dummy-data', {
                method: 'GET',
            })

        }
        toast.add({ title: "Success, operation " + type + " completed: " + response })

    } catch (error) {
        toast.add({ title: "ERROR: " + error })
        console.error('ERROR:', error)
    }

}

const closeModal = () => {
    isOpen.value = false
}

</script>