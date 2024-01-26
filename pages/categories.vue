<template>
    <div>
        <h2>Categories</h2>
        <CustomTable :columns="columns" :itemList="filteredCategories" />
    </div>
</template>

<script setup>
//setups and imports
import { useRuntimeConfig } from '#app'
import { useAuthStore } from '~/store/auth'

const runtimeConfig = useRuntimeConfig()
const authStore = useAuthStore();
let authenticatedUser = authStore.getAuthenticatedUser()

const transactionList = ref([]);
const filteredCategories = ref([]);
const columns = ref([]);

//functions
//TODO this is irrelevant, as the categories names are included in the transaction list
const getCategories = async () => {
    const response = await $fetch(runtimeConfig.public.BACKEND_API_BASE_PATH + '/categories/user/' + authenticatedUser.id, {
        method: 'GET',
    })

    //fill columns with all categories
    let auxObject = {
        key: 'date',
        label: 'date'
    }
    columns.value.push(auxObject)

    for (let i = 0; i < response.length; i++) {
        auxObject = {
            key: response[i].name,
            label: response[i].name
        }

        columns.value.push(auxObject)
    }
}

const getTransactions = async () => {
    try {

        await getCategories();

        const response = await $fetch(runtimeConfig.public.BACKEND_API_BASE_PATH + '/transactions/user/' + authenticatedUser.id, {
            method: 'GET',
        })

        //turn all dates into a readable format
        let auxArray = response;
        for (let i = 0; i < auxArray.length; i++) {
            if (auxArray[i].date) {
                auxArray[i].date = auxArray[i].date.slice(0, 7);
            }
        }

        transactionList.value = auxArray;

        let auxArray2 = []
        let auxMonth = {}
        let currentTransactionCategoryName = ''
        let currentTransactionDate = ''
        let currentTransactionAmount = ''

        //sort array into monthly categories
        for (let i = 0; i < transactionList.value.length; i++) {

            currentTransactionCategoryName = transactionList.value[i].category_name
            currentTransactionDate = transactionList.value[i].date
            currentTransactionAmount = transactionList.value[i].amount

            var result = auxArray2.findIndex(obj => {
                return obj.date === currentTransactionDate;
            });

            if (result >= 0) {
                auxArray2[result][currentTransactionCategoryName] = (auxArray2[result][currentTransactionCategoryName] || 0) + turnIntoTwoDecimal(currentTransactionAmount);
            } else {
                auxMonth.date = currentTransactionDate
                auxMonth[currentTransactionCategoryName] = turnIntoTwoDecimal(currentTransactionAmount)
                auxArray2.push(auxMonth)
                auxMonth = {}
            }
        }

        filteredCategories.value = auxArray2;
    } catch (error) {
        console.error('ERROR:', error)
    }
}
getTransactions();

const turnIntoTwoDecimal = (number) => {
    return parseFloat(parseFloat(number).toFixed(2));
}
</script>