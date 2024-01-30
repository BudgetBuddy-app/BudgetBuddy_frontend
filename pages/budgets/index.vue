<template>
    <div>
        <h2>Budgets</h2>

        <div class="flex items-center">
            <UButton label="Create budget" @click="isOpen = true; mode = 'Create'" />
            <UButton @click="getBudgets(); toast.add({ title: 'Refreshing list... ' })">
                <Icon name="ic:baseline-refresh" />
            </UButton>
        </div>
        <CRUDBudgetModal :isOpen="isOpen" :mode="mode" :budgetToEdit="budgetToEdit" @update:isOpen="isOpen = $event"
            @refreshList="getBudgets()" @closeModal="closeModal()" />

        <CustomTable :columns="columns" :items="items" :itemList="budgetList" />
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

let budgetList = ref([]);
const isOpen = ref(false)
const mode = ref('')
const budgetToEdit = ref({})

//table variables
const columns = [
    {
        key: 'id',
        label: 'ID',
        sortable: 'true'
    }, {
        key: 'name',
        label: 'Name',
        sortable: 'true'
    }, {
        key: 'amount',
        label: 'Amount',
        sortable: 'true'
    }, {
        key: 'start_date',
        label: 'Start Date',
        sortable: 'true'
    }, {
        key: 'end_date',
        label: 'End Date',
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

//functions
const reDirect = async (type, row) => {
    if (type == 'Details') {
        await navigateTo('/budgets/' + row.id);
    } else {
        mode.value = type
        budgetToEdit.value = row
        isOpen.value = true
    }
}

const getBudgets = async () => {
    try {
        let response = await $fetch(runtimeConfig.public.BACKEND_API_BASE_PATH + '/budgets/user/' + authenticatedUser.id, {
            method: 'GET',
        })

        for (let i = 0; i < response.length; i++) {

            response[i].start_date = response[i].start_date.split('T')[0];
            response[i].end_date = response[i].end_date.split('T')[0];
        }
        budgetList.value = response;
    } catch (error) {
        console.error('ERROR:', error)
    }
}
getBudgets();

//TODO get transactions and calculate how much we actually spent between those dates

const closeModal = () => {
    isOpen.value = false
}

</script>