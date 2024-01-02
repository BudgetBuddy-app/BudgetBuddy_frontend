<template>
    <div>
        <h2>Account id: {{ id }} </h2>
        <h3>Account info: {{ accountInfo }}</h3>

        <UButton label="Create transaction" @click="isOpen = true" />
        <CreateEditTransactionModal :isOpen="isOpen" @update:isOpen="isOpen = $event" />

        <div>showing {{ transactionList.length }} transaction:</div>
        <UTable :rows="transactionList" :columns="columns">
            <template #actions-data="{ row }">
                <UDropdown :items="items(row)">
                    <UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-horizontal-20-solid" />
                </UDropdown>
            </template>
        </UTable>
    </div>
</template>

<script setup>
//setups and imports
const { id } = useRoute().params

import { useRuntimeConfig } from '#app'

const runtimeConfig = useRuntimeConfig()

const isOpen = ref(false)

let accountInfo = ref([]);
let transactionList = ref([]);

//table variables
const columns = [
    {
        key: 'id',
        label: 'ID'
    }, {
        key: 'amount',
        label: 'Amount'
    }
    , {
        key: 'type',
        label: 'Type'
    }
    , {
        key: 'date',
        label: 'Date'
    }
    , {
        key: 'recipient_id',
        label: 'Recipient id'
    }
    , {
        key: 'account_id',
        label: 'Account id'
    }
    , {
        key: 'notes',
        label: 'Notes'
    }
    , {
        key: 'actions'
    }
]

const items = (row) => [
    [{
        label: 'Details',
        icon: 'heroicons:information-circle-20-solid',
        click: () => reDirect('Details', row.id)
    }],
    [{
        label: 'Edit',
        icon: 'i-heroicons-pencil-square-20-solid',
        click: () => reDirect('Edit', row.id)
    }, {
        label: 'Delete',
        icon: 'i-heroicons-trash-20-solid',
        click: () => reDirect('Delete', row.id)
    }]
]

//functions
const getAccountInfo = async () => {
    try {
        const response = await $fetch(runtimeConfig.public.BACKEND_API_BASE_PATH + '/accounts/' + id, {
            method: 'GET',
        })
        accountInfo.value = response;
    } catch (error) {
        console.error('ERROR:', error)
    }
}

const getAccountTransactions = async () => {
    try {
        const response = await $fetch(runtimeConfig.public.BACKEND_API_BASE_PATH + '/transactions/account/' + id, {
            method: 'GET',
        })
        transactionList.value = response;
    } catch (error) {
        console.error('ERROR:', error)
    }
}

const reDirect = async (type, id) => {
    switch (type) {
        case 'Details':
            console.log("TODO details")
            //TODO details page
            break;
        case 'Edit':
            console.log("TODO edit")
            //TODO recycle the create modal to also edit an account
            break;
        case 'Delete':
            console.log("TODO delete")
            //TODO add a popup to delete
            break;
        default:
            console.error('Invalid type');
    }
}

getAccountInfo();
getAccountTransactions();
</script>