<template>
    <div>
        <h2>Accounts</h2>

        <div class="flex items-center">
            <UButton label="Create account" @click="isOpen = true; mode = 'Create'" />
            <UButton @click="getUserAccounts(); toast.add({ title: 'Refreshing list... ' })">
                <Icon name="ic:baseline-refresh" />
            </UButton>
        </div>
        <CRUDAccountModal :isOpen="isOpen" :mode="mode" :accountToEdit="accountToEdit" @update:isOpen="isOpen = $event"
            @refreshList="getUserAccounts()" @closeModal="closeModal()" />

        <CustomTable :columns="columns" :items="items" :itemList="accountList" />
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

let accountList = ref([]);
const isOpen = ref(false)
const mode = ref('')
const accountToEdit = ref({})

//table variables
const columns = [
    {
        key: 'id',
        label: 'ID',
        sortable: 'true'
    }, {
        key: 'name',
        label: 'Account Name',
        sortable: 'true'
    }, {
        key: 'total_amount',
        label: 'Total amount',
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
        await navigateTo('/accounts/' + row.id);
    } else {
        mode.value = type
        accountToEdit.value = row
        isOpen.value = true
    }
}

const getUserAccounts = async () => {
    try {
        const response = await $fetch(runtimeConfig.public.BACKEND_API_BASE_PATH + '/accounts/user/' + authenticatedUser.id, {
            method: 'GET',
        })
        accountList.value = response;
    } catch (error) {
        console.error('ERROR:', error)
    }
}
getUserAccounts();

const closeModal = () => {
    isOpen.value = false
}

</script>