<template>
    <div>
        <h3>All transactions</h3>

        <div class="flex items-center">
            <UButton label="Create transaction" @click="isOpen = true; mode = 'Create'" />
            <UButton @click="getTransactions(); toast.add({ title: 'Refreshing list... ' })">
                <Icon name="ic:baseline-refresh" />
            </UButton>
        </div>
        <CRUDTransactionModal :isOpen="isOpen" :mode="mode" :transactionToEdit="transactionToEdit"
            @update:isOpen="isOpen = $event" @refreshList="getTransactions()" @closeModal="closeModal()" />

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
import { useRuntimeConfig } from '#app'
import { useAuthStore } from '~/store/auth'

const toast = useToast()
const runtimeConfig = useRuntimeConfig()
const authStore = useAuthStore();
let authenticatedUser = authStore.getAuthenticatedUser()


const isOpen = ref(false)
const transactionList = ref([]);
const mode = ref('')
const transactionToEdit = ref({})

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
        key: 'date',
        label: 'Date (yyyy-mm-dd)'
    }
    , {
        key: 'recipient',
        label: 'Recipient'
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
        click: () => reDirect('Details', row)
    }],
    [{
        label: 'Edit',
        icon: 'i-heroicons-pencil-square-20-solid',
        click: () => reDirect('Edit', row)
    }, {
        label: 'Delete',
        icon: 'i-heroicons-trash-20-solid',
        click: () => reDirect('Delete', row)
    }]
]

//functions

const getTransactions = async () => {
    try {
        const response = await $fetch(runtimeConfig.public.BACKEND_API_BASE_PATH + '/transactions/user/' + authenticatedUser.id, {
            method: 'GET',
        })

        //turn all dates into a readable format
        let auxArray = response;
        for (let i = 0; i < auxArray.length; i++) {
            if (auxArray[i].date) {
                auxArray[i].date = auxArray[i].date.split('T')[0];
            }
        }

        transactionList.value = auxArray;
    } catch (error) {
        console.error('ERROR:', error)
    }
}
getTransactions();

const reDirect = async (type, row) => {
    switch (type) {
        case 'Details':
            await navigateTo('/transactions/' + row.id);
            break;
        case 'Edit':
            mode.value = 'Edit'
            transactionToEdit.value = row
            isOpen.value = true
            break;
        case 'Delete':
            mode.value = 'Delete'
            transactionToEdit.value = row
            isOpen.value = true
            break;
        default:
            console.error('Invalid type');
    }
}

const closeModal = () => {
    isOpen.value = false
}

</script>