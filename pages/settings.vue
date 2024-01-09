<template>
    <div>
        <h2>Settings</h2>
    </div>

    Import transactions from csv

    <form @submit.prevent="submitForm">
        <UButton @click="chooseFiles">Select File</UButton>
        <input ref="fileRef" type="file" hidden @change="handleFileChange">
        <UButton type="submit">Submit</UButton>
    </form>
</template>
 
<script setup>
import { useRuntimeConfig } from '#app'
import { useAuthStore } from '~/store/auth'

const toast = useToast()
const runtimeConfig = useRuntimeConfig()
const authStore = useAuthStore();
const authenticatedUser = authStore.getAuthenticatedUser()

const fileRef = ref(null);
let selectedFile = null;

//TODO when file is changed after selecting no error is displayed on screen but it shows one on console

const submitForm = async () => {
    let formData = new FormData();

    try {

        formData.append('file', selectedFile, 'filename.csv');

        const response = await $fetch(runtimeConfig.public.BACKEND_API_BASE_PATH + '/csv/transactions/' + authenticatedUser.id, {
            method: 'POST',
            body: formData
        })

        toast.add({ title: "File submitted successfully" })
    } catch (error) {
        toast.add({ title: "ERROR: " + error })
    }
}

const chooseFiles = () => {
    fileRef.value.click();
}

const handleFileChange = (event) => {
    selectedFile = event.target.files[0];
}

</script>