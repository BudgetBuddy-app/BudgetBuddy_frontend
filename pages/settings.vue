<template>
    <div>
        <h2>Settings</h2>
    </div>

    Import transactions from csv

    <form @submit.prevent="submitCSV">
        <UButton @click="chooseFiles">Select File</UButton>
        <input ref="fileRef" type="file" hidden @change="handleFileChange">
        <UButton type="submit">Submit</UButton>
    </form>

    <div>
        <span>Download CSV with all transactions</span>
        <UButton @click="downloadTransactionsCSV">Download CSV</UButton>
    </div>

    <h1>Quick currency convertion</h1>
    <form @submit.prevent="submitCurrencyConversion">
        <label>Original Currency:</label>
        <USelectMenu searchable v-model="selectedOriginalCurr" :options="currencyList" option-attribute="name" />
        <label>Amount:</label>
        <UInput type="decimal" v-model="conversionInput" />
        <label>Result Currency:</label>
        <USelectMenu searchable v-model="selectedDestinationCurr" :options="currencyList" option-attribute="name" />
        <label>Amount:</label>
        <UInput disabled type="decimal" v-model="conversionOutput" />
        <UButton type="submit">Submit</UButton>
    </form>
</template>
 
<script setup>
//TODO when file is changed after selecting no error is displayed on screen but it shows one on console, validate ALL errors
import { useRuntimeConfig } from '#app'
import { useAuthStore } from '~/store/auth'

const toast = useToast()
const runtimeConfig = useRuntimeConfig()
const authStore = useAuthStore();
const authenticatedUser = authStore.getAuthenticatedUser()

const fileRef = ref(null);
let selectedFile = null;

const currencyList = ref([])
const selectedOriginalCurr = ref(currencyList[0])
const selectedDestinationCurr = ref(currencyList[0])
const conversionInput = ref(0)
const conversionOutput = ref(0)

const submitCSV = async () => {
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

const submitCurrencyConversion = async () => {
    const response = await $fetch('https://api.exchangerate-api.com/v4/latest/' + selectedOriginalCurr.value.name)

    //find the currency and multiply our value
    for (let currency in response.rates) {
        if (currency == selectedDestinationCurr.value.name) {
            conversionOutput.value = conversionInput.value * response.rates[currency]
        }
    }
}

const getCurrencyList = async () => {
    const response = await $fetch('https://api.exchangerate-api.com/v4/latest/EUR')

    //setup list to show to user for selecting the currency
    let auxCurrency = {}
    for (let currency in response.rates) {
        auxCurrency = {
            name: currency
        }
        currencyList.value.push(auxCurrency)
    }
}
getCurrencyList()

const chooseFiles = () => {
    fileRef.value.click();
}

const handleFileChange = (event) => {
    selectedFile = event.target.files[0];
}

const downloadTransactionsCSV = async () => {
    try {
        const response = await $fetch(runtimeConfig.public.BACKEND_API_BASE_PATH + '/csv/transactions/user/' + authenticatedUser.id);

        downloadFile(response, 'transactionsExport.csv', 'text/csv');

        toast.add({ title: "File downloaded successfully" })
    } catch (error) {
        toast.add({ title: "ERROR downloading file: " + error })
    }
}

function downloadFile(content, fileName, contentType) {
    const blob = new Blob([content], { type: contentType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
}
</script>