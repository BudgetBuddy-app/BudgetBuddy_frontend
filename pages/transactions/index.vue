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
        label: 'ID',
        sortable:'true'
    }, {
        key: 'amount',
        label: 'Amount',
        sortable:'true'
    }
    , {
        key: 'date',
        label: 'Date (yyyy-mm-dd)',
        sortable:'true'
    }
    , {
        key: 'recipient',
        label: 'Recipient',
        sortable:'true'
    }
    , {
        key: 'notes',
        label: 'Notes',
        sortable:'true'
    }, {
        key: 'category_name',
        label: 'Category',
        sortable:'true'
    }, {
        key: 'account_name',
        label: 'Account',
        sortable:'true'
    }, {
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
    if (type == 'Details') {
        await navigateTo('/transactions/' + row.id);
    } else {
        mode.value = type
        transactionToEdit.value = row
        isOpen.value = true
    }
}

const closeModal = () => {
    isOpen.value = false
}

</script>