<template>
    <div>
        <div>Amount: {{ transaction.amount }}</div>
        <div>Date: {{ transaction.date }}</div>
        <div>Recipient: {{ transaction.recipient }}</div>
        <div>Notes: {{ transaction.notes }}</div>
        <div>Category: {{ transaction.category_name }}</div>
    </div>
</template>

<script setup>
import { useRuntimeConfig } from '#app'

const runtimeConfig = useRuntimeConfig()
const { id } = useRoute().params

const transaction = ref({})

const getTransaction = async () => {
    try {
        let response = await $fetch(runtimeConfig.public.BACKEND_API_BASE_PATH + '/transactions/' + id, {
            method: 'GET',
        })

        //turn date into a readable format
        response.date = response.date.split('T')[0];

        transaction.value = response;
    } catch (error) {
        console.error('ERROR:', error)
    }
}
getTransaction();
</script>