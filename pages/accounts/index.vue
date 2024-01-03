<template>
    <div>
        <h2>Accounts</h2>

        <UButton label="Create account" @click="isOpen = true" />
        <UButton @click="getUserAccounts()">
            <Icon name="ic:baseline-refresh" />
        </UButton>
        <CreateEditAccountModal :authenticatedUser="authenticatedUser" :isOpen="isOpen" @update:isOpen="isOpen = $event"
            @refreshList="getUserAccounts()" />

        <div>showing {{ accountList.length }} accounts:</div>
        <UTable :rows="accountList" :columns="columns">
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

const runtimeConfig = useRuntimeConfig()
const authStore = useAuthStore();
let authenticatedUser = authStore.getAuthenticatedUser()

let accountList = ref([]);
const isOpen = ref(false)

//table variables
const columns = [
    {
        key: 'id',
        label: 'ID'
    }, {
        key: 'name',
        label: 'Account Name'
    }, {
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

const reDirect = async (type, id) => {
    switch (type) {
        case 'Details':
            await navigateTo('/accounts/' + id);
            break;
        case 'Edit':
            console.log("edit")
            //TODO recycle the create modal to also edit an account
            break;
        case 'Delete':
            console.log("delete")
            //TODO add a popup to delete
            break;
        default:
            console.error('Invalid type');
    }
}

</script>