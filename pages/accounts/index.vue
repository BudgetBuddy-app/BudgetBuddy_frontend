<template>
    <div>
        <h2>Accounts</h2>

        <h4>Create Account</h4>
        <form @submit.prevent="submitForm">
            <label>Name:</label>
            <input type="name" v-model="accountToCreate.name" />
            <UButton type="submit">Submit</UButton>
        </form>
        <div>showing {{ accountList.length }} accounts:</div>
        <div v-for="account in accountList" class="border border-red-600">
            <span>
                <NuxtLink :to="accountUrl(account)">
                    <Icon name="material-symbols:info" />
                </NuxtLink>
            </span>
            <span>{{ account }}</span>
        </div>
    </div>
</template>

<script setup>
import { useRuntimeConfig } from '#app'
import { useAuthStore } from '~/store/auth'

const runtimeConfig = useRuntimeConfig()
const authStore = useAuthStore();
let authenticatedUser = authStore.getAuthenticatedUser()

let accountToCreate = {
    name: ''
};

let accountList = ref([]);

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

const submitForm = async () => {
    try {
        accountToCreate.user_id = authenticatedUser.id
        const response = await $fetch(runtimeConfig.public.BACKEND_API_BASE_PATH + '/accounts', {
            method: 'POST',
            body: JSON.stringify(accountToCreate),
            headers: {
                'Content-Type': 'application/json'
            }
        })

        //TODO make this a popup, not a console log
        console.log("Success: ", response)

        getUserAccounts();

    } catch (error) {
        console.error('ERROR:', error)
    }
};

const accountUrl = (account) => {
    return '/accounts/' + account.id;
}

</script>