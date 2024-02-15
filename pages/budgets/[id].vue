<template>
    <div>
        <div>name: {{ budget.name }}</div>
        <div>start date: {{ budget.start_date }}</div>
        <div>end date: {{ budget.end_date }}</div>
        <div>amount: {{ budget.amount }}</div>
    </div>
</template>

<script setup>
import { useRuntimeConfig } from '#app'

const runtimeConfig = useRuntimeConfig()
const { id } = useRoute().params

const budget = ref({})

const getBudget = async () => {
    try {
        let response = await $fetch(runtimeConfig.public.BACKEND_API_BASE_PATH + '/budgets/' + id, {
            method: 'GET',
        })

        //turn date into a readable format
        response.start_date = response.start_date.split('T')[0];
        response.end_date = response.end_date.split('T')[0];

        budget.value = response;
    } catch (error) {
        console.error('ERROR:', error)
    }
}
getBudget();
</script>