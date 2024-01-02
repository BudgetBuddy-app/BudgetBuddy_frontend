<template>
    <div>
        <h2>Account id: {{ id }} </h2>
        <h3>Account info: {{ accountInfo }}</h3>
    </div>
</template>

<script setup>

const { id } = useRoute().params

import { useRuntimeConfig } from '#app'

const runtimeConfig = useRuntimeConfig()

let accountInfo = ref([]);


const getUserAccounts = async () => {
    try {
        const response = await $fetch(runtimeConfig.public.BACKEND_API_BASE_PATH + '/accounts/' + id, {
            method: 'GET',
        })
        accountInfo.value = response;
    } catch (error) {
        console.error('ERROR:', error)
    }
}
getUserAccounts();

</script>