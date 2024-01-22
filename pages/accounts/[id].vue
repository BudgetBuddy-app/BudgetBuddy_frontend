<template>
    <div>
        <h3>Account: {{ accountInfo.name }}</h3>

        <div class="flex items-center">
            <UButton label="Create transaction" @click="isOpen = true; mode = 'Create'" />
            <UButton @click="getAccountTransactions(); toast.add({ title: 'Refreshing list... ' })">
                <Icon name="ic:baseline-refresh" />
            </UButton>
        </div>
        <CRUDTransactionModal :isOpen="isOpen" :mode="mode" :transactionToEdit="transactionToEdit"
            :parentAccount="accountInfo" @update:isOpen="isOpen = $event" @refreshList="getAccountTransactions()"
            @closeModal="closeModal()" />
        <div>
            <div class="flex px-3 py-3.5 border-b border-gray-200 dark:border-gray-700">
                <UInput v-model="q" placeholder="Filter transactions..." />
            </div>
            <UTable :rows="rows" :columns="columns">
                <template #actions-data="{ row }">
                    <UDropdown :items="items(row)">
                        <UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-horizontal-20-solid" />
                    </UDropdown>
                </template>
            </UTable>
            <div class="flex justify-end px-3 py-3.5 border-t border-gray-200 dark:border-gray-700">
                <UPagination v-model="page" :page-count="pageCount" :total="filteredRows.length" />
            </div>
        </div>
    </div>
</template>

<script setup>
//setups and imports
import { useRuntimeConfig } from '#app'

const { id } = useRoute().params
const toast = useToast()
const runtimeConfig = useRuntimeConfig()

const isOpen = ref(false)
const accountInfo = ref({});
const transactionList = ref([]);
const mode = ref('')
const transactionToEdit = ref({})

const q = ref('');
const page = ref(1);
const pageCount = 10;

//table variables
const columns = [
    {
        key: 'id',
        label: 'ID',
        sortable: 'true'
    }, {
        key: 'amount',
        label: 'Amount',
        sortable: 'true'
    }
    , {
        key: 'date',
        label: 'Date (yyyy-mm-dd)',
        sortable: 'true'
    }
    , {
        key: 'recipient',
        label: 'Recipient',
        sortable: 'true'
    }
    , {
        key: 'notes',
        label: 'Notes',
        sortable: 'true'
    }, {
        key: 'category_name',
        label: 'Category',
        sortable: 'true'
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

//table functions
const filteredRows = computed(() => {
    if (!q.value) {
        return transactionList.value;
    }

    return transactionList.value.filter((transaction) => {
        return Object.values(transaction).some((value) => {
            if (typeof value === 'string') {
                value = value.trim();
            }
            return String(value).toLowerCase().includes(q.value.toLowerCase());
        });
    });
});

const rows = computed(() => {
    return filteredRows.value.slice((page.value - 1) * pageCount, (page.value) * pageCount);
});

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

//other functions
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
getAccountInfo();

const getAccountTransactions = async () => {
    try {
        const response = await $fetch(runtimeConfig.public.BACKEND_API_BASE_PATH + '/transactions/account/' + id, {
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
getAccountTransactions();

const closeModal = () => {
    isOpen.value = false
}

</script>